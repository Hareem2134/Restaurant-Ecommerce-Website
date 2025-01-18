"use client";
import React, { useEffect, useState } from "react";
import ForAllHeroSections from "../../../components/ForAllHeroSections";
import ProductCardOnShop from "../../../components/ProductCardOnShop";
import FiltersSidebarOnShop from "../../../components/FiltersSidebarOnShop";
import PaginationOnShop from "../../../components/PaginationOnShop";
import { client } from "../../sanity/lib/client"; // Import the Sanity client

// Define the Food interface
interface Food {
  id: string; // Map Sanity's _id
  name: string;
  price: number;
  originalPrice?: number; // Optional field
  image: string; // Extracted URL for image
  description?: string; // Optional field
  tags?: string[]; // Array of tags
  available: boolean; // Availability status
  category?: string; // Optional category
  isOnSale: boolean; // Add this field to match ProductCardOnShop expectations
}

export default function ShopPage() {
  const [products, setProducts] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from Sanity
  useEffect(() => {
    async function fetchProducts() {
      try {
        // Define GROQ query to fetch food items
        const query = `*[_type == "food"]{
          _id,
          name,
          price,
          originalPrice,
          "image": image.asset->url,
          description,
          tags,
          available,
          category
        }`;

        const sanityProducts = await client.fetch(query); // Fetch from Sanity

        // Map _id to id and ensure the structure matches the Food interface
        const mappedProducts = sanityProducts.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || null,
          image: product.image || "",
          description: product.description || "",
          tags: product.tags || [],
          available: product.available || false,
          category: product.category || "",
          isOnSale: product.originalPrice
            ? product.price < product.originalPrice // Calculate if on sale
            : false,
        }));

        setProducts(mappedProducts); // Set fetched products
        setIsLoading(false); // Update loading state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div>
        <ForAllHeroSections />
      </div>

      {/* Main Shop Layout */}
      <div
        id="main-content"
        className="transition-all duration-700 max-w-[1320px] mx-auto flex flex-col lg:flex-row space-y-12 lg:space-y-0 lg:space-x-12 mt-12 mb-12 px-4 sm:px-8 lg:px-36"
      >
        {/* Main Content */}
        <div className="flex-1">
          {/* Sorting and Show Controls */}
          <div className="flex flex-wrap items-center mb-6 gap-4">
            <div className="transition-all duration-300 hover:scale-105">
              <label className="mr-2">Sort By:</label>
              <select className="border rounded p-2 pr-2">
                <option className="text-gray-400">Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <label className="mr-2">Show:</label>
              <select className="border rounded p-2 pr-24">
                <option className="text-gray-400">Default</option>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div>Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product.id} // Use id here
                  className="transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
                >
                  <ProductCardOnShop product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <PaginationOnShop />
        </div>

        {/* Sidebar */}
        <FiltersSidebarOnShop />
      </div>
    </>
  );
}
