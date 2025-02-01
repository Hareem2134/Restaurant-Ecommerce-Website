"use client";
import { useState } from "react";
import { client } from "../src/sanity/lib/client";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);

  const trackOrder = async () => {
    const result = await client.fetch(
      `*[_type == "order" && _id == $id][0]{
        _id,
        status,
        total,
        "items": items[]{
          product->{name, price},
          quantity
        },
        shippingAddress
      }`,
      { id: orderId }
    );
    setOrder(result);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Track Your Order</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Order ID"
          className="flex-1 p-2 border rounded"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={trackOrder}
        >
          Track
        </button>
      </div>
      
      {order && (
        <div className="space-y-4">
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <div>
            <strong>Items:</strong>
            <ul className="list-disc pl-6">
              {order.items.map((item: any, index: number) => (
                <li key={index}>
                  {item.product.name} (Qty: {item.quantity})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}






// "use client"
// import React, { useState } from "react";

// interface Order {
//   id: number;
//   status: string;
//   estimatedDelivery: string;
// }

// const OrderTracking: React.FC = () => {
//   const [orders] = useState<Order[]>([
//     { id: 101, status: "Shipped", estimatedDelivery: "2025-01-25" },
//     { id: 102, status: "In Transit", estimatedDelivery: "2025-01-28" },
//   ]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
//       <ul>
//         {orders.map((order) => (
//           <li key={order.id} className="mb-4">
//             <strong>Order #{order.id}</strong>
//             <p>Status: {order.status}</p>
//             <p>Estimated Delivery: {order.estimatedDelivery}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default OrderTracking;
