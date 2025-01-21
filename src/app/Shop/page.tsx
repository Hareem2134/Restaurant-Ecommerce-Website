"use client";
import React, { useEffect, useState } from "react";
import ForAllHeroSections from "../../../components/ForAllHeroSections";
import ProductCardOnShop from "../../../components/ProductCardOnShop";
import FiltersSidebarOnShop from "../../../components/FiltersSidebarOnShop";
import PaginationOnShop from "../../../components/PaginationOnShop";
import { client } from "../../sanity/lib/client";
import Link from "next/link";

interface Food {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description?: string;
  tags?: string[];
  available: boolean;
  category?: string;
  isOnSale: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
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

        const sanityProducts = await client.fetch(query);

        const mappedProducts = sanityProducts
        .filter((product: any) => product.slug?.current) // Exclude products without slugs
        .map((product: any) => ({
          id: product._id,
          slug: product.slug.current,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || null,
          image: product.image || "/placeholder.jpg", // Fallback to a placeholder image
          description: product.description || "",
          tags: product.tags || [],
          available: product.available || false,
          category: product.category || "",
          isOnSale: product.originalPrice
            ? product.price < product.originalPrice
            : false,
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
      <div>
        <ForAllHeroSections />
      </div>
      <div
        id="main-content"
        className="transition-all duration-700 max-w-[1320px] mx-auto flex flex-col lg:flex-row space-y-12 lg:space-y-0 lg:space-x-12 mt-12 mb-12 px-4 sm:px-8 lg:px-36"
      >
        <div className="flex-1">
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

          {isLoading ? (
            <div>Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product.slug} href={`/product/${product.slug}`}>
                  <div className="transition-all duration-500 transform hover:scale-105 hover:shadow-2xl">
                    <ProductCardOnShop product={product} />
                  </div>
                </Link>
              ))}
            </div>
          )}

          <PaginationOnShop />
        </div>

        <FiltersSidebarOnShop />
      </div>
    </>
  );
}
