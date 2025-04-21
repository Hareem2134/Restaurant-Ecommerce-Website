// components/FiltersSidebarOnShop.tsx
"use client";

import React, { useState } from 'react';
import Image from 'next/image'; // Use Next.js Image
import { FaSearch, FaStar } from 'react-icons/fa'; // Import icons
import clsx from 'clsx';

export default function FiltersSidebarOnShop() {
  // --- Data and State (Keep your original data/state) ---
  const latestProducts = [ // Example data - use your actual data source
    { id: 1, name: 'Pizza', price: 35, stars: 4, image: '/latestproduct.png', category: 'Pizza' },
    { id: 2, name: 'Cupcake', price: 15, stars: 5, image: '/latestproduct.png', category: 'Cupcake' },
    { id: 3, name: 'Cookies', price: 25, stars: 3, image: '/latestproduct.png', category: 'Cookies' },
  ];
  const categories = [ 'Sandwiches', 'Burger', 'Chicken Chup', 'Drink', 'Pizza', 'Thi', 'Non Veg', 'Uncategorized'];
  const productTags = [ 'Services', 'Our Menu', 'Pizza', 'Cupcake', 'Burger', 'Cookies', 'Our Shop', 'Tandoori Chicken'];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(8000); // Keep state
  // --- End Data and State ---

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]);
  };

  // Filter logic remains the same
  const filteredProducts = latestProducts.filter(product => (selectedCategories.length === 0 || selectedCategories.includes(product.category)) && product.price <= priceRange);

  return (
    // --- Restore Padding, Keep w-full for parent control ---
    // Parent div in ShopPage.tsx should control width (e.g., lg:w-1/4)
    <aside className="w-full p-4 md:p-6 space-y-8 border-r border-gray-200 dark:border-gray-700">

      {/* Search Field - Restoring visual container */}
      <div>
        <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-md transition-shadow duration-200 hover:shadow-md">
          <input
            type="text"
            placeholder="Search Product..."
            className="w-full h-11 md:h-12 pl-4 pr-14 text-sm text-gray-700 dark:text-gray-200 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-orange-500 rounded-md" // Ensure rounded-md for focus ring
          />
          {/* Restore Search Button Style */}
          <button
            type="button"
            aria-label="Search"
            className="absolute right-0 top-0 w-11 md:w-12 h-11 md:h-12 bg-orange-500 hover:bg-orange-600 text-white flex justify-center items-center rounded-r-md transition-colors" // Rounded only on right
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Category Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">Category</h3>
        {/* --- Keep max-height for desktop, maybe less strict on mobile --- */}
        <ul className="space-y-1.5 max-h-60 md:max-h-72 lg:max-h-80 overflow-y-auto pr-2 custom-scrollbar"> {/* Added custom-scrollbar class */}
          {categories.map((category, index) => (
            <li key={index} className="text-sm transition-transform duration-200 hover:translate-x-1">
              <label className="flex items-center cursor-pointer group py-1">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 dark:bg-gray-700 dark:checked:bg-orange-500 dark:checked:border-transparent transition duration-150 ease-in-out"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {category}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected Categories Tags - Restoring original style */}
      {selectedCategories.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-sm mb-2 text-gray-600 dark:text-gray-400">Selected Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                // --- Restore original Tag Style ---
                className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full cursor-pointer hover:bg-orange-600 transition-colors"
                onClick={() => toggleCategory(category)}
                title={`Remove ${category}`}
              >
                {category} ×
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Banner Image - Restore hover effect */}
      <div
        className="my-4 hidden md:block">
         <div className="overflow-hidden rounded-lg shadow hover:shadow-xl transition-shadow duration-300 ease-in-out max-h-96 md:max-h-[500px] lg:max-h-none"> {/* Example Max Height */}
            <Image
              src="/Banner.png" // Ensure path is correct
              alt="Promotional Banner"
              width={400}  // Provide the INTRINSIC width of your image file
              height={500} // Provide the INTRINSIC height of your image file
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300" // Let height be auto
              priority // Prioritize loading if important
            />
          </div>
      </div>

      {/* Filter By Price */}
      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">Filter By Price</h3>
        <div className="space-y-2 px-1">
           {/* Restore pulsing dots if desired, using absolute positioning relative to the range container */}
           <div className="relative pt-1"> {/* Add padding-top to contain dots */}
               <input
                 type="range"
                 min="0" max="8000" value={priceRange}
                 onChange={(e) => setPriceRange(Number(e.target.value))}
                 className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500 range-slider-track" // Custom class for track potentially
               />
               {/* Restore pulsing dots - position relative to the input's container */}
               <div className="w-4 h-4 bg-orange-500 rounded-full absolute left-0 top-0 ring-2 ring-orange-300 dark:ring-orange-700 animate-pulse" style={{ left: `calc(${(priceRange / 8000) * 100}% - 8px)` }}></div> {/* Approximate position */}
           </div>
          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 pt-1">
            <span>Price: $0 - ${priceRange}</span>
            {/* Optionally restore reset button */}
             <button className="text-xs hover:underline text-orange-600 hover:text-orange-700" onClick={() => setPriceRange(8000)} > Reset </button>
          </div>
        </div>
      </div>

      {/* Latest Products Section */}
      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">Latest Products</h3>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            // Restore hover scale effect and structure
            <div key={product.id} className="flex items-center gap-3 group cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02]">
              <Image
                src={product.image} alt={product.name} width={64} height={64}
                className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-700 flex-shrink-0 shadow-sm"
              />
              <div className="text-sm overflow-hidden"> {/* Added overflow hidden */}
                <p className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate"> {/* Added truncate */}
                  {product.name}
                </p>
                 {/* Restore dynamic stars */}
                <div className="text-yellow-500 text-xs flex items-center mt-0.5">
                    {[...Array(product.stars ?? 0)].map((_, i) => <FaStar key={`f-${i}`} />)}
                    {[...Array(5 - (product.stars ?? 0))].map((_, i) => <FaStar key={`e-${i}`} className="text-gray-300 dark:text-gray-600" />)}
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold mt-0.5">${product.price}</p>
              </div>
            </div>
          )) : (
             <p className="text-sm text-gray-500 italic p-2">No products match filters.</p>
          )}
        </div>
      </div>

      {/* Product Tags Section - Restore hover effect */}
      <div>
        <h3 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100">Product Tags</h3>
        <div className="flex flex-wrap gap-2">
          {productTags.map((tag, index) => (
            <span
              key={index}
              // Restore original hover effect
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs px-3 py-1 rounded-md transition-all duration-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 dark:hover:bg-orange-600 dark:hover:border-orange-600 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Add CSS for custom scrollbar if desired */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5); // gray-400 with opacity
          border-radius: 10px;
          border: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(107, 114, 128, 0.7); // gray-500 with opacity
        }
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }

        /* Basic range input track styling (limited cross-browser) */
        .range-slider-track::-webkit-slider-runnable-track {
            /* Customize track appearance if needed */
        }
        .range-slider-track::-moz-range-track {
             /* Customize track appearance if needed */
        }
      `}</style>

    </aside>
  );
}