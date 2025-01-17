"use client";
import React from "react";
import Image from "next/image";

// Inside ProductCardOnShop.tsx
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    oldPrice?: number;
    isOnSale: boolean;
    image: string;
  };
}


export interface Product {
  id: string; 
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  isOnSale: boolean;
}

const ProductCardOnShop: React.FC<ProductCardProps> = ({ product }) => {

    const cardClass = `relative border p-4 rounded-lg hover:shadow-lg`;

  return (
    <div className={cardClass}>
      {/* Sale Tag */}
      {product.isOnSale && (
        <span className="absolute top-2 left-2 text-sm text-white bg-orange-500 rounded px-2 py-1 z-10">
          Sale
        </span>
      )}

      {/* Product Image with Hover Effect */}
      <div className="relative group overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-opacity-90 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Image
            src="/ShopHoverIcon.png"
            alt="Shop Hover Icon"
            width={90} height={90}
          />
        </div>
      </div>

      {/* Product Name */}
      <h3 className="font-semibold text-lg mt-2">{product.name}</h3>

      {/* Product Price */}
      <div className="flex items-center mt-2">
        <span className="text-orange-500 font-bold">${product.price}</span>
        {product.oldPrice && (
          <span className="text-gray-500 line-through ml-2">${product.oldPrice}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCardOnShop;
