// File: src/app/payment/page.tsx
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Load Stripe on the client side
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

// Stripe instance for the API route (server-side)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia", // Latest stable API version
});

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Call the same file's API route for payment processing
      const response = await fetch("/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50, currency: "usd" }),
      });

      const { sessionId } = await response.json();

      if (!sessionId) {
        alert("Failed to initiate payment.");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        alert("Stripe initialization failed.");
        return;
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe Checkout Error:", error.message);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment processing failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
      <button
        className={`px-6 py-3 text-white font-bold rounded ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
        }`}
        disabled={loading}
        onClick={handlePayment}
      >
        {loading ? "Processing..." : "Pay $50"}
      </button>
    </div>
  );
}

// ✅ API Route (Server Action) inside the same file
export async function POST(req: Request) {
  try {
    const { amount, currency } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Missing required payment details" },
        { status: 400 }
      );
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Your Product" },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
