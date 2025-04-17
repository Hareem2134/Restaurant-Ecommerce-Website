// src/app/product/[slug]/ProductDetailsWrapper.tsx

"use client";

import dynamic from "next/dynamic";
// *** IMPORT THE SHARED TYPE ***
import { SanityProduct } from "@/types/productTypes"; // Adjust path if needed

// Dynamically import the main details component
const DynamicProductDetails = dynamic(() => import("@/app/product/ProductDetails"), {
  ssr: false, // Keep ssr: false if ProductDetails uses client-only hooks/features heavily
});

// Define props using the SHARED type
interface WrapperProps {
  product: SanityProduct; // <-- Use the imported SanityProduct type
  previousSlug: string | null;
  nextSlug: string | null;
}

export default function ProductDetailsWrapper({
  product,
  previousSlug,
  nextSlug,
}: WrapperProps) { // Use the interface for props
  // No transformation needed, types match now
  return (
    <DynamicProductDetails
        product={product}
        previousSlug={previousSlug}
        nextSlug={nextSlug}
    />
  );
}