// src/app/api/payment/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// --- Environment Variable Setup ---
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cart`;

if (!stripeSecretKey) { console.error("..."); /* Handle missing key */ }
// ... check NEXT_PUBLIC_BASE_URL ...

// --- Initialize Stripe ---
const stripe = new Stripe(stripeSecretKey || "sk_test_...", {
  apiVersion: "2025-02-24.acacia", // Use latest Stripe API version
  typescript: true,
});

// --- API Route Handler ---
export async function POST(req: NextRequest) {
  console.log("API Route /api/payment (Checkout Session) hit");
  try {
    const body = await req.json();
    // --- FIX: Destructure ITEMS, currency, etc. ---
    const { items, currency, customerEmail, metadata } = body;

    // --- FIX: Validate the ITEMS array ---
    if (!items || !Array.isArray(items) || items.length === 0) {
        console.error("Invalid/Missing items array received:", items);
        // *** THIS IS LIKELY THE ERROR MESSAGE YOU SHOULD BE SEEING ***
        // If you see "Invalid payment amount" it means you're running OLD API code
        return NextResponse.json({ error: "Invalid or missing line items." }, { status: 400 });
    }
    // --- End Validation Fix ---

    const finalCurrency = currency || "usd";
    console.log(`Received checkout request: ${items.length} items, Currency=${finalCurrency}, Email=${customerEmail}, Meta=${JSON.stringify(metadata)}`);

    // --- Format Line Items ---
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => {
        // Add more robust validation inside the map
        const price = Number(item.price);
        const quantity = Number(item.quantity);
        if (typeof item.name !== 'string' || isNaN(price) || isNaN(quantity) || quantity <= 0 || price < 0.50) { // Stripe min $0.50
            console.error("Invalid item data found during mapping:", item);
            throw new Error(`Invalid item data provided: ${item.name || 'Unknown Item'}`); // Throw error to stop session creation
        }
        return {
            price_data: {
                currency: finalCurrency,
                product_data: { name: item.name, images: item.image ? [item.image] : [] },
                unit_amount: Math.round(price * 100), // Use validated price
            },
            quantity: quantity, // Use validated quantity
        };
    });

    // --- Create a Stripe Checkout Session ---
    console.log("Creating Stripe Checkout Session...");
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        line_items: line_items,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(customerEmail && { customer_email: customerEmail }),
        ...(metadata && { metadata: metadata }), // Pass received metadata
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log(`Stripe Checkout Session created: ${session.id}`);

    return NextResponse.json({ sessionId: session.id });

  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    let clientErrorMessage = "Failed to create checkout session.";
    if (error instanceof Stripe.errors.StripeError) { clientErrorMessage = error.message; }
    else if (error instanceof Error && error.message.startsWith('Invalid item data')) {
        // Pass back specific item validation error
        clientErrorMessage = error.message;
        return NextResponse.json({ error: clientErrorMessage }, { status: 400 }); // Return 400 for bad item data
    }
    return NextResponse.json({ error: clientErrorMessage, details: error.message }, { status: 500 });
  }
}