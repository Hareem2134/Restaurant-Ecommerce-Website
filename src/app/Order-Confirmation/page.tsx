"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface Order {
  orderId: string;
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
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
}

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const orderIdFromUrl = searchParams.get("orderId");

  useEffect(() => {
    if (!orderIdFromUrl) {
      console.warn("❌ No orderId found in URL!");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/order/${orderIdFromUrl}`, { cache: "no-store" });

        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Order fetched from API:", data);

        setOrder({ ...data, orderId: data.orderId || orderIdFromUrl });
      } catch (error) {
        console.error("❌ Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderIdFromUrl]);

  if (loading) {
    return <p className="text-center text-gray-600 text-lg">Loading order details...</p>;
  }

  if (!order) {
    return <p className="text-center text-red-500 text-lg">Order not found.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-3xl mx-auto mt-10 border border-gray-400 bg-white p-6 rounded-lg shadow-xl shadow-gray-400 mb-32 text-center md:w-11/12 lg:w-3/4"
    >
      <div className="text-center mb-6">
        <motion.h2 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-gray-900"
        >
          🎉 Order Confirmed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-600 text-base md:text-lg mt-2"
        >
          Thank you for your order! Your <strong>Order ID</strong> is: {" "}
          <span className="font-semibold text-orange-600">{order.orderId}</span>
        </motion.p>
      </div>

      <div className="border-t border-gray-300 mt-6 pt-6 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📦 Order Summary</h3>
        {order.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
            {order.items.map((item, index) => (
              <motion.div
                key={item.id || index}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center border-b pb-4 transition-all duration-300"
              >
                <motion.img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-20 md:w-24 h-20 md:h-24 rounded-lg shadow-md border border-gray-200"
                  whileHover={{ scale: 1.05 }}
                />
                <p className="font-semibold text-gray-900 text-base md:text-lg mt-2">{item.name}</p>
                <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No items found in this order.</p>
        )}

        <div className="mt-6 text-gray-700 text-base md:text-lg space-y-2">
          <p><strong>Subtotal:</strong> ${order.subtotal.toFixed(2)}</p>
          <p><strong>Discount:</strong> -${order.discount.toFixed(2)}</p>
          <p><strong>Shipping Cost:</strong> ${order.shippingCost.toFixed(2)}</p>
          <p className="text-2xl font-bold text-gray-900 mt-3">
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-6 pt-6 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">📍 Shipping Address</h3>
        <p className="text-gray-700 text-base md:text-lg">
          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.zip}, {order.shippingAddress.country}
        </p>
      </div>

      <motion.div className="flex flex-col items-center mt-8 space-y-4">
        <Link
          href="/"
          className="flex gap-2 px-8 md:px-10 py-3 text-white font-semibold bg-gradient-to-r from-[#FF9F0D] to-[#e58b0a] rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
        >
          <Home size={20} /> Back to Home
        </Link>
        <span className="text-gray-500 font-medium">— OR —</span>
        <Link
          href="/Shop"
          className="flex gap-2 px-6 md:px-8 py-3 text-white font-semibold bg-gradient-to-r from-[#FF9F0D] to-[#e58b0a] rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
        >
          <ShoppingCart size={20} /> Continue Shopping
        </Link>
      </motion.div>
    </motion.div>
  );
}
