"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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

function ShopPageContent() {
  const [products, setProducts] = useState<Food[]>([]);
  const [wishlist, setWishlist] = useState<Food[]>([]);
  const [cart, setCart] = useState<Food[]>([]);
  const [compare, setCompare] = useState<Food[]>([]);
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

  // Handlers for Wishlist, Cart, and Compare
  const handleAddToWishlist = (product: Food) => {
    if (!wishlist.find((item) => item.id === product.id)) {
      setWishlist([...wishlist, product]);
      alert(`${product.name} added to Wishlist!`);
    } else {
      alert(`${product.name} is already in Wishlist!`);
    }
  };

  const handleAddToCart = (product: Food) => {
    if (!cart.find((item) => item.id === product.id)) {
      setCart([...cart, product]);
      alert(`${product.name} added to Cart!`);
    } else {
      alert(`${product.name} is already in Cart!`);
    }
  };

  const handleCompare = (product: Food) => {
    if (!compare.find((item) => item.id === product.id)) {
      setCompare([...compare, product]);
      alert(`${product.name} added to Compare List!`);
    } else {
      alert(`${product.name} is already in Compare List!`);
    }
  };

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
          {isLoading ? (
            <div>Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCardOnShop
                  key={product.id}
                  product={product}
                  onAddToWishlist={handleAddToWishlist}
                  onAddToCart={handleAddToCart}
                  onCompare={handleCompare}
                >
                  {/* Link for the clickable title */}
                  <h3 className="font-semibold text-lg mt-2">
                    <Link href={`/product/${product.slug}`}>
                      <a className="hover:underline text-blue-600">
                        {product.name}
                      </a>
                    </Link>
                  </h3>
                </ProductCardOnShop>
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
