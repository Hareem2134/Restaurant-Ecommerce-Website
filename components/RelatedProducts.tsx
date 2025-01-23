"use client";

import React from "react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

const RelatedProducts: React.FC = () => {
  const relatedProducts: Product[] = [
    { id: 1, name: "Product A", category: "Category 1", price: 99 },
    { id: 2, name: "Product B", category: "Category 1", price: 149 },
    { id: 3, name: "Product C", category: "Category 2", price: 199 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded shadow hover:shadow-md"
          >
            <h3 className="font-semibold">{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
