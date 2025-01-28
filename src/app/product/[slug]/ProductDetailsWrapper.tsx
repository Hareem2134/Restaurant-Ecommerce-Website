"use client";

import dynamic from "next/dynamic";
import { ProductType } from "../../../types/product"; // Adjust the import path as needed

const DynamicProductDetails = dynamic(() => import("@/app/product/ProductDetails"), {
  ssr: false,
});

export default function ProductDetailsWrapper({
  product,
  previousSlug,
  nextSlug,
}: {
  product: ProductType;
  previousSlug: string | null;
  nextSlug: string | null;
}) {
  return <DynamicProductDetails product={product} previousSlug={previousSlug} nextSlug={nextSlug} />;
}
