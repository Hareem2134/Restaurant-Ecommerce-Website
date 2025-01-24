// src/app/product/[slug]/page.tsx

import ProductDetails from "@/app/product/ProductDetails";
import { client } from "@/sanity/lib/client";

// Explicitly define the type for `params` inline
export default async function ProductDetailsPage({
  params,
}: {
  params: { slug: string }; // Type the dynamic route parameter correctly
}) {
  const { slug } = params;

  // Fetch product data based on slug
  const product = await client.fetch(
    `*[_type == "food" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      price,
      originalPrice,
      image {
        asset {
          _ref
        }
      },
      description,
      tags,
      available,
      category
    }`,
    { slug }
  );

  // Handle case where product is not found
  if (!product) {
    return (
      <div>
        <h1>Product Not Found</h1>
        <p>The product you're looking for does not exist.</p>
      </div>
    );
  }

  // Render product details if found
  return <ProductDetails product={product} />;
}

// Correctly implement `generateStaticParams` for dynamic routing
export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(`*[_type == "food"].slug.current`);
  return slugs.map((slug) => ({ slug })); // Ensure slugs are correctly returned
}
