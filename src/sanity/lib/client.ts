import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2023-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

async function addSlugsToFoods() {
  const foods = await client.fetch(`*[_type == "food" && !defined(slug)]`);
  for (const food of foods) {
    const slug = food.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await client
      .patch(food._id)
      .set({ slug: { current: slug } })
      .commit();
    console.log(`Added slug "${slug}" to food: ${food.name}`);
  }
}

addSlugsToFoods();