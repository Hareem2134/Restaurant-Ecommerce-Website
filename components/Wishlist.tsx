"use client"
import React, { useState, useEffect } from "react";

interface Product {
  name: string;
}

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(savedWishlist);
  }, []);

  const handleAddToWishlist = (product: Product) => {
    const updatedWishlist = [...wishlist, product];
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  return (
    <div>
      <h2>My Wishlist</h2>
      <ul>
        {wishlist.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
      <button onClick={() => handleAddToWishlist({ name: "Sample Product" })}>
        Add to Wishlist
      </button>
    </div>
  );
};

export default Wishlist;
