import { NextRequest, NextResponse } from "next/server"; // Import NextRequest if needed later
import Stripe from "stripe";

// Validate environment variable (optional but good practice)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    console.error("FATAL ERROR: STRIPE_SECRET_KEY environment variable is not set.");
    // Avoid using fallback keys in production environments if possible
    // For local dev, the fallback is okay, but ensure it's a TEST key
    // throw new Error("Stripe secret key is not configured.");
}

// Initialize Stripe with a VALID and recommended API version
const stripe = new Stripe(stripeSecretKey || "sk_test_...", { // Use your TEST key for fallback
  // --- Use the latest recommended version from Stripe Docs ---
  // Example: As of mid-2024
  apiVersion: "2025-02-24.acacia",
  // --- Or the specific version your integration requires ---
  typescript: true, // Enable TypeScript definitions from the library
});

export async function POST(req: Request) {
  console.log("API Route /api/payment hit");
  try {
    const body = await req.json();
    const { amount, currency, payment_method_id, customer_id } = body; // Destructure expected fields

    // Basic Validation
    if (typeof amount !== 'number' || amount <= 0) {
        console.error("Invalid amount received:", amount);
        return NextResponse.json({ error: "Invalid payment amount." }, { status: 400 });
    }
    const finalCurrency = currency || "usd"; // Default currency
    console.log(`Received payment request: Amount=${amount}, Currency=${finalCurrency}, PM_ID=${payment_method_id}, Cust_ID=${customer_id}`);


    // --- Create a Payment Intent ---
    // Amount must be in the smallest currency unit (e.g., cents for USD)
    const amountInCents = Math.round(amount * 100);
    console.log(`Creating PaymentIntent for ${amountInCents} ${finalCurrency.toUpperCase()}`);

    const paymentIntentOptions: Stripe.PaymentIntentCreateParams = {
        amount: amountInCents,
        currency: finalCurrency,
        // Add payment method types if needed (often automatic)
        automatic_payment_methods: { enabled: true },
        // --- Optionally include other parameters ---
        // payment_method: payment_method_id, // Required if not using automatic methods and confirming immediately
        // customer: customer_id, // Associate with a Stripe Customer object if available
        // confirm: true, // Set to true to attempt capture immediately (requires payment_method)
        // off_session: false, // Usually false for checkout flows
        // description: `Order payment for [Your Order ID]`, // Add description
        // metadata: { order_id: 'your_order_id' }, // Link to your internal order
    };

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
    console.log(`PaymentIntent created: ${paymentIntent.id}, Status: ${paymentIntent.status}`);

    // Return only the client_secret needed by the frontend (Stripe.js/Elements)
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (error: any) {
    console.error("Stripe API Error:", error);
    // Provide a more generic error message to the client for security
    let clientErrorMessage = "Failed to initiate payment.";
    if (error instanceof Stripe.errors.StripeCardError) {
        // Handle card errors specifically if needed
        clientErrorMessage = error.message; // Can show card errors directly
    }
    // You might want different handling for StripeAuthenticationError, StripeConnectionError etc.

    return NextResponse.json(
        { error: clientErrorMessage, details: error.message }, // Include details for server logs/debugging
        { status: 500 }
    );
  }
}