import ProductDetails from "@/app/product/ProductDetails";
import { client } from "@/sanity/lib/client";
import { Metadata } from "next";
import { GetStaticPaths, GetStaticProps } from "next";

export const dynamicParams = true;

// Use Next.js-provided type for `PageProps`
export type PageProps = {
  params: Record<string, any>; // Matches dynamic route params
};

// Fix generateStaticParams typing
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs: string[] = await client.fetch(`*[_type == "food"].slug.current`);
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = params;

  const productQuery = `
    *[_type == "food" && slug.current == $slug][0]{
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
      longDescription,
      tags,
      images[] {
        asset {
          _ref
        }
      },
      reviews[] {
        user,
        rating,
        comment
      },
      available,
      category
    }`;

  const adjacentQuery = `
    {
      "previous": *[_type == "food" && slug.current < $slug] | order(slug.current desc)[0].slug.current,
      "next": *[_type == "food" && slug.current > $slug] | order(slug.current asc)[0].slug.current
    }`;

  const product = await client.fetch(productQuery, { slug });
  const adjacentSlugs = await client.fetch(adjacentQuery, { slug });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-semibold text-gray-800">Product Not Found</h1>
        <p className="text-lg text-gray-600 mt-4">
          Sorry, the product you're looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <ProductDetails
      product={product}
      previousSlug={adjacentSlugs.previous || null}
      nextSlug={adjacentSlugs.next || null}
    />
  );
}

// Generate Metadata with explicit params type
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  const product = await client.fetch(
    `*[_type == "food" && slug.current == $slug][0]{ name, description }`,
    { slug }
  );

  return {
    title: product?.name || "Product Not Found",
    description: product?.description || "This product does not exist.",
  };
}
