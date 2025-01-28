"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import ProductCardOnShop from "./ProductCardOnShop";
import { client } from "../src/sanity/lib/client";

interface SimilarProductsProps {
  currentProductId: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  isOnSale: boolean;
}

const SimilarProductsSection: React.FC<SimilarProductsProps> = ({
  currentProductId,
}) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarProducts() {
      console.log("Fetching similar products excluding currentProductId:", currentProductId);

      try {
        const query = `*[_type == "food"][0...10]{
          _id,
          name,
          slug,
          price,
          originalPrice,
          "image": image.asset->url
        }`;

        const products = await client.fetch(query);

        const filteredProducts = products.filter(
          (product: any) => product._id !== currentProductId
        );

        console.log("Fetched similar products:", filteredProducts);

        const mappedProducts = filteredProducts.map((product: any) => ({
          id: product._id,
          slug: product.slug?.current || "", // Ensure slug exists
          name: product.name || "",
          price: product.price || 0,
          oldPrice: product.originalPrice || null,
          image: product.image || "/placeholder.jpg", // Fallback image
          isOnSale: product.originalPrice
            ? product.price < product.originalPrice
            : false,
        }));

        setSimilarProducts(mappedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching similar products:", error);
        setIsLoading(false);
      }
    }

    fetchSimilarProducts();
  }, [currentProductId]);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        Similar Products You May Like
      </h2>
      {isLoading ? (
        <div className="text-center">Loading similar products...</div>
      ) : similarProducts.length > 0 ? (
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="group"
        >
          {similarProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="group-hover:shadow-lg transition-shadow duration-300">
                <ProductCardOnShop
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    oldPrice: product.oldPrice || 0,
                    isOnSale: product.isOnSale,
                    image: product.image,
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="text-center">No similar products found.</div>
      )}
    </div>
  );
};

export default SimilarProductsSection;
