// src/components/AIRecommendations.tsx
import React from "react";

const AIRecommendations: React.FC = () => {
  const recommendedProducts = [
    { id: 1, name: "Recommended Product 1", price: 99 },
    { id: 2, name: "Recommended Product 2", price: 149 },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">AI Recommendations</h2>
      <ul>
        {recommendedProducts.map((product) => (
          <li key={product.id} className="mb-2">
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIRecommendations;
