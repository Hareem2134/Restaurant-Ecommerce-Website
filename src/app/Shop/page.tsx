"use client";

import React, { useEffect, useState } from "react";
import ForAllHeroSections from "../../../components/ForAllHeroSections";
import ProductCardOnShop from "../../../components/ProductCardOnShop";
import FiltersSidebarOnShop from "../../../components/FiltersSidebarOnShop";
import PaginationOnShop from "../../../components/PaginationOnShop";
import { client } from "../../sanity/lib/client"; // Import the client

// Define the Product interface
interface Product {
  id: string; // Map Sanity's _id
  name: string;
  price: number;
  oldPrice?: number;
  isOnSale: boolean;
  image: string; // Extracted URL for image
}

// Component-specific props
interface ProductCardProps {
  product: Product;
}


export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from Sanity
  useEffect(() => {
    async function fetchProducts() {
      try {
        const query = `*[_type == "product"]{
          _id,
          name,
          price,
          "oldPrice": oldPrice, // Replace field names based on your schema
          "image": mainImage.asset->url,
          isOnSale
        }`;
        const sanityProducts = await client.fetch(query); // Use the imported client

        // Map _id to id
        const mappedProducts = sanityProducts.map((product: any) => ({
          id: parseInt(product._id, 10),
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          image: product.image,
          isOnSale: product.isOnSale,
        }));

        setProducts(mappedProducts);
        setIsLoading(false);
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
