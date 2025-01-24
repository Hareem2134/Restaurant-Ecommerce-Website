import ProductDetails from "@/app/product/ProductDetails";
import { client } from "@/sanity/lib/client";

interface PageProps {
  params: { slug: string }; // Define the structure for `params`
}

export async function generateStaticParams() {
    const slugs = await client.fetch(`*[_type == "food"].slug.current`);
    return slugs.map((slug: string) => ({ slug }));
  }
  

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = params;

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

  if (!product) {
    return (
      <div>
        <h1>Product Not Found</h1>
        <p>The product you're looking for does not exist.</p>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
