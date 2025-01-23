"use client"
import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Sample Product 1", price: 100, category: "Category A" },
    { id: 2, name: "Sample Product 2", price: 150, category: "Category B" },
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Manage Products */}
      <div className="bg-white p-4 shadow-md rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Manage Products</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id} className="py-2 border-b">
              {product.name} - ${product.price} ({product.category})
            </li>
          ))}
        </ul>
      </div>

      {/* Manage Orders */}
      <div className="bg-white p-4 shadow-md rounded-md mb-6">
        <h3 className="text-lg font-semibold mb-2">Manage Orders</h3>
        <p>Orders management UI coming soon...</p>
      </div>

      {/* Analytics Tools */}
      <div className="bg-white p-4 shadow-md rounded-md">
        <h3 className="text-lg font-semibold mb-2">Analytics Tools</h3>
        <p>Business insights and analytics tools coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
