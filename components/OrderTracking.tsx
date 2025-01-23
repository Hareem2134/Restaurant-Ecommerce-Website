"use client"
import React, { useState } from "react";

interface Order {
  id: number;
  status: string;
  estimatedDelivery: string;
}

const OrderTracking: React.FC = () => {
  const [orders] = useState<Order[]>([
    { id: 101, status: "Shipped", estimatedDelivery: "2025-01-25" },
    { id: 102, status: "In Transit", estimatedDelivery: "2025-01-28" },
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id} className="mb-4">
            <strong>Order #{order.id}</strong>
            <p>Status: {order.status}</p>
            <p>Estimated Delivery: {order.estimatedDelivery}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderTracking;
