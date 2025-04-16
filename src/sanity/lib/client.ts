import { createClient, type SanityClient } from 'next-sanity'
import { apiVersion, dataset, projectId} from '../env'

export function getClient(preview?: { token: string }): SanityClient {
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2021-10-21",
  // token: process.env.SANITY_API_WRITE_TOKEN,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  perspective: 'published',
  stega: { // Stega config if using Visual Editing
     enabled: false,
     studioUrl: '/studio', // Or your Studio location
  },
});
if (preview) {
  if (!preview.token) {
    throw new Error('Missing preview token')
  }
  return client.withConfig({
    token: preview.token,
    useCdn: false,
    ignoreBrowserTokenWarning: true,
    perspective: 'previewDrafts',
  })
}
return client
}

// Export the default client instance configured for writes
export const client: SanityClient = getClient();

// You could potentially export a separate read client if needed
// export const readClient = createClient({ ...config with useCdn: true, no token ... });



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