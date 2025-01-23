"use client"
import React, { useState } from "react";

interface Discount {
  id: number;
  code: string;
  percentage: number;
}

const DiscountPromotion: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([
    { id: 1, code: "SAVE10", percentage: 10 },
    { id: 2, code: "SUMMER20", percentage: 20 },
  ]);

  const handleAddDiscount = () => {
    const newDiscount = { id: discounts.length + 1, code: "NEWCODE", percentage: 15 };
    setDiscounts([...discounts, newDiscount]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Discount Promotion</h2>
      <ul>
        {discounts.map((discount) => (
          <li key={discount.id} className="mb-2">
            Code: <strong>{discount.code}</strong> - Discount:{" "}
            <strong>{discount.percentage}%</strong>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddDiscount}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add New Discount
      </button>
    </div>
  );
};

export default DiscountPromotion;
