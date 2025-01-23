"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface OrderDetails {
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}

export default function OrderConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true); // Loading state to prevent rendering during updates

  useEffect(() => {
    const fetchOrderDetails = () => {
      const storedOrder = localStorage.getItem("orderDetails");
      if (storedOrder) {
        setOrderDetails(JSON.parse(storedOrder) as OrderDetails);
      } else {
        // Redirect to home if no order details exist
        window.location.href = "/";
      }
      setLoading(false); // End loading after fetching data
    };

    fetchOrderDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return null; // Prevent further rendering if no order details
  }

  const { items, subtotal, discount, shippingCost, total } = orderDetails;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-green-600 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Thank you for your order. Here are your order details:
        </p>

        {/* Order Summary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id ?? `order-item-${index}`} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Cost</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-[#FF9F0D] text-white shadow-black font-bold rounded shadow hover:bg-[#e58b0a] inline-block"
          >
            Back to Home
          </Link>

            <h3 className="font-bold">OR</h3>

        {/* Back to Home Button */}
          <Link
            href="/Shop"
            className="px-6 py-3 bg-[#FF9F0D] text-white font-bold shadow-black rounded shadow hover:bg-[#e58b0a] inline-block"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
