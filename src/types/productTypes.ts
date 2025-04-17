// Define the structure reflecting Sanity data
// This should be the SINGLE SOURCE OF TRUTH for your product data structure
export interface SanityProduct {
    _id: string;                     // Sanity document ID
    name: string;
    slug?: { current?: string };     // Sanity slug structure { current: 'actual-slug' }
    description?: string;
    longDescription?: string;
    price: number;                   // Ensure this is always a number
    originalPrice?: number | null;   // Optional comparison price
    image?: { asset?: { _ref?: string } }; // Reference to main Sanity image asset
    images?: { asset?: { _ref?: string } }[]; // Array of references to additional image assets
    category?: string;               // Optional category name
    tags?: string[];                 // Optional array of tags
    reviews?: {                      // Optional array of reviews
        id?: string | number;        // Review ID (if applicable)
        user: string;
        rating: number;
        comment: string
        // Add date or other review fields if needed
    }[];
    // Add any other fields fetched from your 'food' or product schema
    available?: boolean;             // Example: If you have availability
  }