"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "next-sanity";

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  image?: string;
  description?: string;
  tags?: string[];
  available: boolean;
  category?: string;
};

// Initialize Sanity Client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all products for initial load and suggestions
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const query = `*[_type == "food"]{
          _id,
          name,
          slug,
          price,
          originalPrice,
          "image": image.asset->url,
          description,
          tags,
          available,
          category
        }`;
        const result = await sanityClient.fetch(query);
        setSuggestions(result);
      } catch (error) {
        console.error("Error fetching products from Sanity:", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Fetch filtered products when searchQuery changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (!searchQuery) {
        setProducts([]);
        return;
      }

      try {
        setIsSearching(true);
        const query = `*[_type == "food" && name match "${searchQuery}*"]{
          _id,
          name,
          slug,
          price,
          originalPrice,
          "image": image.asset->url,
          description,
          tags,
          available,
          category
        }`;
        const result = await sanityClient.fetch(query);
        setProducts(result);
        setIsSearching(false);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        setIsSearching(false);
      }
    };

    fetchFilteredProducts();
  }, [searchQuery]);

  // Handle suggestion click
  const handleSuggestionClick = (name: string) => {
    setSearchQuery(name); // Set the selected suggestion
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Products</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for products..."
        className="border border-gray-300 p-2 rounded-lg mb-4 w-full"
        list="product-suggestions"
      />
      <datalist id="product-suggestions">
        {suggestions.map((product) => (
          <option
            key={product._id}
            value={product.name}
            onClick={() => handleSuggestionClick(product.name)}
          />
        ))}
      </datalist>

      {isSearching && <p>Searching...</p>}

      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li
              key={product._id}
              className="border border-gray-300 p-4 rounded-lg mb-4"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
              )}
              <p className="text-gray-500">{product.description}</p>
              <p className="text-gray-700">
                Price: ${product.price.toFixed(2)}{" "}
                {product.originalPrice && (
                  <span className="line-through text-gray-500">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </p>
              <p className="text-gray-500">
                Tags: {product.tags?.join(", ") || "No tags available"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        !isSearching && <p>No results found for "{searchQuery}".</p>
      )}
    </div>
  );
};

export default SearchPage;
