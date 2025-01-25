"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "../Context/CartContext"; // Import Cart Context
import { FiTrash2 } from "react-icons/fi";
import { FaCartPlus } from "react-icons/fa";

interface ComparedProduct {
  id: string;
  slug: string; // Use slug for navigating to the product detail page
  name: string;
  price: number;
  image?: string; // Ensure image is optional to prevent runtime errors
  description?: string;
  rating?: number;
}

const ProductComparison: React.FC = () => {
  const [comparedProducts, setComparedProducts] = useState<ComparedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ComparedProduct[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("price-asc");
  const { addToCart, cart } = useCart(); // Access cart and addToCart from Cart Context

  useEffect(() => {
    // Load comparison products from localStorage
    const storedProducts = JSON.parse(localStorage.getItem("comparisonProducts") || "[]");
    setComparedProducts(storedProducts);
  }, []);

  useEffect(() => {
    // Apply filtering and sorting
    let products = [...comparedProducts];

    if (filterRating) {
      products = products.filter((product) => product.rating && product.rating >= filterRating);
    }

    if (sortOrder === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(products);
  }, [filterRating, sortOrder, comparedProducts]);

  const handleRemoveProduct = (id: string) => {
    const updatedProducts = comparedProducts.filter((product) => product.id !== id);
    setComparedProducts(updatedProducts);
    localStorage.setItem("comparisonProducts", JSON.stringify(updatedProducts));
  };

  const handleAddToCart = (product: ComparedProduct) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || "/placeholder.jpg", // Fallback for missing image
      quantity: 1,
    };

    addToCart(cartItem); // Add to global cart context
  };

  return (
    <div className="max-w-4xl mx-auto my-12 px-4 sm:px-8 mb-36">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Product Comparison</h1>

      {/* Filter and Sort Options */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <label htmlFor="rating-filter" className="font-medium text-gray-700 mr-2">
            Minimum Rating:
          </label>
          <select
            id="rating-filter"
            className="border border-gray-300 rounded-lg p-2"
            value={filterRating || ""}
            onChange={(e) => setFilterRating(Number(e.target.value) || null)}
          >
            <option value="">All</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-order" className="font-medium text-gray-700 mr-2">
            Sort by Price:
          </label>
          <select
            id="sort-order"
            className="border border-gray-300 rounded-lg p-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="price-asc">Low to High</option>
            <option value="price-desc">High to Low</option>
          </select>
        </div>
      </div>

      {/* Cart Count */}
      <div className="text-right mb-6">
        <span className="text-lg font-medium text-gray-800">
          Cart Items: <span className="text-orange-500 font-bold">{cart.length}</span>
        </span>
      </div>

      {/* Product Cards */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No products match the criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Product Image */}
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.jpg"} // Fallback for missing image
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Product Details */}
                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/product/${product.slug}`}>
                    <h3
                      className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-orange-500 transition-colors"
                    >
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {product.description || "No description available."}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-orange-500 font-bold text-lg">${product.price}</span>
                    <div className="text-yellow-500 text-sm">
                      {product.rating ? "⭐".repeat(product.rating) : "No ratings"}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 flex gap-4">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1"
                    >
                    <FaCartPlus />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center space-x-1"
                    >
                    <FiTrash2 />
                    <span>Remove</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProductComparison;
