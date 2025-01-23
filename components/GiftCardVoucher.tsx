"use client"
import React, { useState } from "react";

interface GiftCard {
  id: number;
  code: string;
  balance: number;
}

const GiftCardVoucher: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([
    { id: 1, code: "GIFT100", balance: 100 },
    { id: 2, code: "GIFT50", balance: 50 },
  ]);

  const handleRedeem = (id: number) => {
    setGiftCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, balance: card.balance - 10 } : card
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gift Cards & Vouchers</h2>
      <ul>
        {giftCards.map((card) => (
          <li key={card.id} className="mb-2">
            Code: <strong>{card.code}</strong> - Balance:{" "}
            <strong>${card.balance}</strong>
            <button
              onClick={() => handleRedeem(card.id)}
              className="ml-4 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Redeem $10
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GiftCardVoucher;
