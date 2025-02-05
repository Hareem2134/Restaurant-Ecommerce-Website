"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx"); // Your Publishable Key

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create a payment intent by calling the backend API
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 50, currency: "usd" }), // Example: $50 USD
      });

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        alert("Failed to initiate payment.");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        alert("Stripe initialization failed.");
        return;
      }

      // Redirect to Stripe's Checkout page
      const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret,
      });

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
