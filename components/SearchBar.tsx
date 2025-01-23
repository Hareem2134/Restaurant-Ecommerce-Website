"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "next-sanity";

// Initialize Sanity Client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]); // Store product details after search

  // Fetch all product names for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const query = `*[_type == "food"]{ name }`;
        const result = await sanityClient.fetch(query);
        setSuggestions(result.map((item: { name: string }) => item.name));
      } catch (error) {
        console.error("Error fetching suggestions from Sanity:", error);
      }
    };

    fetchSuggestions();
  }, []);

  // Perform a search query
  const performSearch = async (query: string) => {
    if (query.trim() === "") return;

    try {
      const searchQuery = `*[_type == "food" && name match "${query}*"]{
        _id, name, slug, price, originalPrice, "image": image.asset->url, description, tags
      }`;
      const result = await sanityClient.fetch(searchQuery);

      setProducts(result); // Set the fetched products
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle pressing "Enter" to trigger search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch(searchQuery);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion); // Set search query to selected suggestion
    performSearch(suggestion); // Trigger search for selected suggestion
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for products..."
        className="border border-gray-300 p-2 rounded-lg w-full"
        list="product-suggestions"
      />
      <datalist id="product-suggestions">
        {suggestions.map((name, index) => (
          <option key={index} value={name} />
        ))}
      </datalist>

      {/* Search Results */}
      {products.length > 0 && (
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
      )}
    </div>
  );
};

export default SearchBar;
