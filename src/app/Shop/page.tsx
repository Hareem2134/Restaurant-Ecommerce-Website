"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ForAllHeroSections from "../../../components/ForAllHeroSections";
import ProductCardOnShop from "../../../components/ProductCardOnShop";
import FiltersSidebarOnShop from "../../../components/FiltersSidebarOnShop";
import PaginationOnShop from "../../../components/PaginationOnShop";
import { client } from "../../sanity/lib/client";

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

function ShopPageContent() {
  const [products, setProducts] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

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

        const filteredProducts = mappedProducts.filter((product: Food) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setProducts(filteredProducts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, [searchQuery]);


  return (
    <>
      <div>
        <ForAllHeroSections />
      </div>
      <div
        id="main-content"
        className="transition-all duration-700 max-w-[1320px] mx-auto flex flex-col lg:flex-row space-y-12 lg:space-y-0 lg:space-x-12 mt-12 mb-36 px-4 sm:px-8 lg:px-36"
      >
        <div className="flex-1">
          {isLoading ? (
            <div>Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCardOnShop
                key={product.id}
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  oldPrice: product.originalPrice || 0, // Fallback if no old price
                  isOnSale: product.isOnSale,
                  image: product.image || "/placeholder.jpg" // Fallback image
                }}/>
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading Shop...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
