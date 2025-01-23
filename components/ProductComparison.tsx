"use client";

import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  features: string[];
}

const ProductComparison: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Product A", price: 100, rating: 4.5, features: ["Feature 1", "Feature 2"] },
    { id: 2, name: "Product B", price: 120, rating: 4.0, features: ["Feature 1", "Feature 3"] },
  ]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Comparison</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Rating</th>
              <th className="border p-2">Features</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">${product.price}</td>
                <td className="border p-2">{product.rating}</td>
                <td className="border p-2">
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductComparison;
