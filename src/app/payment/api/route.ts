// src/app/api/payment/route.ts

import { NextRequest, NextResponse } from "next/server"; // Use NextRequest
import Stripe from "stripe";

// --- Environment Variable Setup ---
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`; // Use distinct success page, pass session ID
const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cart`; // Redirect back to cart on cancel

if (!stripeSecretKey) {
    console.error("FATAL ERROR: STRIPE_SECRET_KEY environment variable is not set.");
    // Handle missing key appropriately for your environment
}
if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.warn("WARN: NEXT_PUBLIC_BASE_URL environment variable is not set. Redirect URLs may be incorrect.");
}

// --- Initialize Stripe with Correct API Version ---
const stripe = new Stripe(stripeSecretKey || "sk_test_...", { // Provide TEST key as fallback for local dev ONLY
  // --- Use the latest stable version or your target version ---
  apiVersion: "2025-02-24.acacia", // Latest stable version as of 2024
  typescript: true,
});

// --- API Route Handler ---
export async function POST(req: NextRequest) { // Use NextRequest
  console.log("API Route /api/payment (Checkout Session) hit");
  try {
    // --- Get Data from Request Body ---
    // For Checkout Session, you usually pass line items or price IDs
    // Let's assume you pass items similar to your previous structure for dynamic pricing
    const body = await req.json();
    const { items, currency, customerEmail, metadata } = body; // Expect items array, currency, optional email/metadata

    // --- Basic Validation ---
    if (!items || !Array.isArray(items) || items.length === 0) {
        console.error("Invalid/Missing items received:", items);
        return NextResponse.json({ error: "Invalid or missing line items." }, { status: 400 });
    }
    const finalCurrency = currency || "usd"; // Default currency

    console.log(`Received checkout request: ${items.length} items, Currency=${finalCurrency}, Email=${customerEmail}`);

    // --- Format Line Items for Stripe Checkout ---
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => {
        // Validate each item
        if (typeof item.name !== 'string' || typeof item.price !== 'number' || typeof item.quantity !== 'number' || item.quantity <= 0 || item.price < 0.50) { // Stripe min charge is $0.50
             throw new Error(`Invalid item data provided: ${JSON.stringify(item)}`);
        }
        return {
            price_data: {
                currency: finalCurrency,
                product_data: {
                    name: item.name,
                    // Optionally add description or images if available
                    // description: item.description,
                     images: item.image ? [item.image] : [], // Pass image URL if you have it
                },
                unit_amount: Math.round(item.price * 100), // Price in smallest unit (cents)
            },
            quantity: item.quantity,
        };
    });

    // --- Create a Stripe Checkout Session ---
    console.log("Creating Stripe Checkout Session...");
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"], // Or other methods like ['card', 'paypal']
        line_items: line_items,
        mode: "payment", // For one-time payments
        success_url: successUrl, // Redirect URL on success
        cancel_url: cancelUrl,   // Redirect URL on cancellation
        // Optionally pass customer email to prefill Stripe checkout
        ...(customerEmail && { customer_email: customerEmail }),
        // Optionally pass metadata to link session to your order
        ...(metadata && { metadata: metadata }), // e.g., metadata: { order_id: 'your_internal_order_id' }
        // Add shipping options if needed (more complex setup)
        // shipping_address_collection: { allowed_countries: ['US', 'CA'] },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log(`Stripe Checkout Session created: ${session.id}`);

    // --- Return the Session ID to the Frontend ---
    // The frontend will use this ID to redirect the user to Stripe Checkout
    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    let clientErrorMessage = "Failed to create checkout session.";
    // Check for specific Stripe errors if needed
    if (error instanceof Stripe.errors.StripeError) {
        clientErrorMessage = error.message; // Stripe errors often have user-friendly messages
    }
    return NextResponse.json(
        { error: clientErrorMessage, details: error.message }, // Log full details server-side
        { status: 500 }
    );
  }
}