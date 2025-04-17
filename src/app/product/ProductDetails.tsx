// src/app/product/ProductDetails.tsx
// Full corrected component

"use client";
import React, { useState, useEffect } from "react"; // Added useEffect for clarity if needed later
import Image from "next/image";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image"; // Ensure this path is correct
import {
  FaStar,
  FaHeart,
  FaSyncAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useCart } from "../Context/CartContext"; // Ensure this path is correct
import { motion } from "framer-motion";
import SocialMediaSharing from "../../../components/SocialMediaSharing"; // Adjust path if needed
import SimilarProductsSection from "../../../components/SimilarProducts"; // Adjust path if needed

// Define a type for the product structure coming from Sanity fetch
// Adjust this based on your actual Sanity schema fields
interface SanityProduct {
  _id: string;
  name: string;
  slug?: { current?: string };
  description?: string;
  longDescription?: string; // Added for the description tab
  price: number;
  originalPrice?: number | null;
  image?: { asset?: { _ref?: string } }; // Main image
  images?: { asset?: { _ref?: string } }[]; // Array of additional images
  category?: string;
  tags?: string[];
  reviews?: any[]; // Define a proper review type if available
  // Add any other fields you fetch
}

// Props for the ProductDetails component
interface ProductDetailsProps {
  product: SanityProduct;
  previousSlug: string | null;
  nextSlug: string | null;
}

// Default placeholder image path
const PLACEHOLDER_IMAGE = "/placeholder-image.png"; // Define placeholder constant

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  previousSlug,
  nextSlug,
}) => {
  const { addToCart } = useCart();
  const router = useRouter();

  // --- State Variables ---
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("longDescription");
  const [notification, setNotification] = useState<string | null>(null);

  // Process images safely, providing fallbacks
  const mainImageUrl = product?.image?.asset?._ref ? urlFor(product.image.asset).url() : null;
  const additionalImages = product?.images
                             ?.map(img => img?.asset?._ref ? urlFor(img.asset).url() : null)
                             .filter((url): url is string => url !== null) // Filter out nulls
                          ?? []; // Default to empty array

  // Combine main and additional images, ensure main is first if it exists
  const allImages = mainImageUrl ? [mainImageUrl, ...additionalImages] : additionalImages;
  // Use the first available image or the placeholder as the initial selected image
  const [selectedImage, setSelectedImage] = useState<string>(allImages[0] ?? PLACEHOLDER_IMAGE);

  // State for reviews (using placeholder structure)
  const [reviews, setReviews] = useState(
    product.reviews?.length > 0
      ? product.reviews // Use real reviews if available
      : [ /* Your placeholder reviews */ ]
  );
  const [newReview, setNewReview] = useState({ user: "", rating: 0, comment: "" });
  // --- End State Variables ---


  // --- Event Handlers ---
  const handleTabClick = (tab: string) => setSelectedTab(tab);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount)); // Ensure quantity doesn't go below 1
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
  };

  const handleAddToCart = () => {
    // FIX: Ensure image passed to addToCart is always a string
    const imageToSend = selectedImage ?? PLACEHOLDER_IMAGE; // Use current selected or placeholder

    console.log("Adding to cart:", {
        id: product._id, name: product.name, price: product.price, image: imageToSend, quantity,
    });

    addToCart({
      id: product._id,      // Use the actual Sanity document ID
      name: product.name,
      price: product.price,
      image: imageToSend,   // Pass the guaranteed string URL
      quantity,
    });
    showNotification(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = () => {
    if (typeof window === "undefined") return;
    const imageToSend = selectedImage ?? PLACEHOLDER_IMAGE; // Use fallback
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (!existingWishlist.some((item: any) => item.id === product._id)) {
      existingWishlist.push({
        id: product._id, name: product.name, image: imageToSend, // Use guaranteed string
        price: product.price, originalPrice: product.originalPrice || null,
        availability: "In stock", quantity: 1, // Assuming quantity 1 for wishlist
      });
      localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
      showNotification(`${product.name} added to wishlist!`);
      router.push("/WishList"); // Navigate after adding
    } else {
      showNotification(`${product.name} is already in wishlist.`);
      // Optionally still navigate even if already present
      // router.push("/WishList");
    }
  };

  const handleAddToCompare = () => {
    if (typeof window === "undefined") return;
    const imageToSend = selectedImage ?? PLACEHOLDER_IMAGE; // Use fallback
    const existingProducts = JSON.parse(localStorage.getItem("comparisonProducts") || "[]");

    if (!existingProducts.some((p: any) => p.id === product._id)) {
      existingProducts.push({
        id: product._id, name: product.name, image: imageToSend, // Use guaranteed string
        price: product.price, category: product.category || "General",
      });
      localStorage.setItem("comparisonProducts", JSON.stringify(existingProducts));
      showNotification(`${product.name} added to comparison list!`);
      router.push("/Product-Comparison"); // Navigate after adding
    } else {
      showNotification(`${product.name} is already in comparison.`);
      // Optionally still navigate
      // router.push("/Product-Comparison");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => { // Add type for event
    e.preventDefault();
    if (!newReview.user || !newReview.rating || !newReview.comment) {
      alert("All review fields are required.");
      return;
    }
    // Ideally, you would send this review to your backend/Sanity to store it
    console.log("Submitting review (implement backend storage):", newReview);
    // For now, just update local state (will be lost on refresh)
    setReviews([...reviews, { ...newReview, id: `local-${reviews.length + 1}` }]); // Use unique local ID
    setNewReview({ user: "", rating: 0, comment: "" }); // Reset form
  };

  const navigateToProduct = (slug: string | null) => {
    if (slug) {
      // Reset quantity when navigating away? Optional.
      // setQuantity(1);
      router.push(`/product/${slug}`);
    }
  };
  // --- End Event Handlers ---


  // --- Prepare data for Social Sharing ---
  // Ensure product slug exists for URL generation
  const productSlug = product?.slug?.current ?? '';
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${productSlug}` : '';
  const productName = product.name;
  // Use selectedImage for consistency or mainImageUrl as fallback
  const shareImage = selectedImage ?? mainImageUrl ?? PLACEHOLDER_IMAGE;
  // --- End Social Sharing Data ---


  // --- Loading State ---
  // This component receives `product` as a prop, so it shouldn't typically have its own loading state
  // unless fetching related data. If `product` itself could be null initially, the parent should handle loading.
  if (!product || !product._id) {
    // This case should ideally be handled by the parent page (e.g., showing a 404 or loading state)
    return <div className="container mx-auto py-20 text-center">Product not found or loading...</div>;
  }
  // --- End Loading State ---


  // --- JSX Rendering ---
  return (
      <motion.div
      className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-36 py-10"
      // Animation props (keep as is)
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      >

      {/* Notification Area */}
      {notification && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-[100]">
          {notification}
        </div>
      )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

        {/* Thumbnails (Left Column - Large Screens) */}
        {allImages.length > 1 && ( // Only show thumbnails if more than one image
            <div className="lg:col-span-2 hidden lg:flex flex-col items-center space-y-4">
            {allImages.map((imgUrl, index) => (
                <motion.div
                key={index}
                className={`w-full aspect-square shadow-md hover:shadow-lg rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                    selectedImage === imgUrl
                    ? "border-orange-500 ring-2 ring-orange-300" // Highlight selected
                    : "border-transparent hover:border-gray-300"
                }`}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedImage(imgUrl)} // Set selected image directly
                >
                <Image
                    src={imgUrl}
                    alt={`Thumbnail ${index + 1}`}
                    width={120} // Fixed size for thumbnails
                    height={120}
                    className="object-cover w-full h-full"
                    priority={index < 3} // Prioritize loading first few images
                />
                </motion.div>
            ))}
            </div>
        )}
         {/* If only one image, maybe occupy space differently or hide thumbnail col */}
         {allImages.length <= 1 && <div className="lg:col-span-2 hidden lg:block"></div>}


        {/* Main Product Image (Center Column) */}
        <div className={`lg:col-span-${allImages.length > 1 ? '6' : '8'} flex flex-col items-center relative`}> {/* Adjust span if no thumbs */}
          <motion.div
            className="w-full max-w-md lg:max-w-full aspect-square relative overflow-hidden rounded-lg shadow-lg border"
            // Add hover effect if desired
            // whileHover={{ scale: 1.03 }}
            // transition={{ duration: 0.3 }}
          >
            {/* Use selectedImage state */}
            <Image
              src={selectedImage} // Use state variable
              alt={product.name}
              fill // Use fill layout
              className="object-contain" // Contain ensures whole image visible
              priority // Prioritize loading the main image
              key={selectedImage} // Add key to force re-render on image change if needed for transitions
            />
             {/* Optional: Add image zoom functionality here */}
          </motion.div>
           {/* Simple mobile/tablet image indicators if needed */}
           {allImages.length > 1 && (
               <div className="flex lg:hidden justify-center space-x-2 mt-4">
                   {allImages.map((imgUrl, index) => (
                       <button
                           key={`dot-${index}`}
                           onClick={() => setSelectedImage(imgUrl)}
                           className={`w-3 h-3 rounded-full transition-colors ${selectedImage === imgUrl ? 'bg-orange-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                           aria-label={`View image ${index + 1}`}
                       />
                   ))}
               </div>
            )}
        </div>


        {/* Product Details (Right Column) */}
        <div className="lg:col-span-4 space-y-4 md:space-y-5">
          {/* Prev/Next Navigation */}
           <div className="flex justify-between items-center text-sm">
             <button
               className={`flex items-center text-orange-600 hover:text-orange-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors`}
               disabled={!previousSlug}
               onClick={() => navigateToProduct(previousSlug)}
             >
               <FaArrowLeft className="mr-1" size={12} /> Prev
             </button>
             <button
               className={`flex items-center text-orange-600 hover:text-orange-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors`}
               disabled={!nextSlug}
               onClick={() => navigateToProduct(nextSlug)}
             >
               Next <FaArrowRight className="ml-1" size={12} />
             </button>
           </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>

          {/* Rating & Stock */}
          <div className="flex items-center justify-between">
             {/* Static Stars - Replace with dynamic rating later */}
             <div className="flex text-yellow-500 space-x-1">
                {[...Array(5)].map((_, i) => <FaStar key={i} size={16}/>)}
                <span className="text-xs text-gray-500 ml-2">({reviews.length} Reviews)</span>
             </div>
             <div className="text-xs sm:text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full font-medium">
                In Stock
             </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3 pt-1">
            <span className="text-3xl font-bold text-orange-600">${product.price?.toFixed(2) ?? 'N/A'}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Short Description */}
          {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded">
              <button onClick={() => handleQuantityChange(-1)} className="px-4 py-2 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-l">-</button>
              <span className="px-5 py-2 text-md font-semibold w-16 text-center">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="px-4 py-2 text-lg font-medium text-gray-600 hover:bg-gray-100 rounded-r">+</button>
            </div>
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-grow px-6 py-3 bg-orange-500 text-white text-sm font-semibold rounded shadow-md hover:bg-orange-600 transition duration-200"
            >
              Add to Cart
            </button>
          </div>

          {/* Wishlist & Compare */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 pt-2">
            <button onClick={handleAddToWishlist} className="flex items-center gap-1 hover:text-orange-600 transition-colors">
              <FaHeart size={14} /> Add to Wishlist
            </button>
            <button onClick={handleAddToCompare} className="flex items-center gap-1 hover:text-orange-600 transition-colors">
              <FaSyncAlt size={14} /> Add to Compare
            </button>
          </div>

          {/* Meta Info (Category/Tags) */}
          <div className="text-xs text-gray-500 space-y-1 border-t pt-4 mt-4">
             <p><strong className="text-gray-600">Category:</strong> {product.category || "Uncategorized"}</p>
             {product.tags && product.tags.length > 0 && (
                <p><strong className="text-gray-600">Tags:</strong> {product.tags.join(", ")}</p>
             )}
             <p><strong className="text-gray-600">SKU/ID:</strong> {product._id}</p>
          </div>

          {/* Social Media Sharing */}
          <div className="border-t pt-4 mt-4">
             <SocialMediaSharing
                productUrl={productUrl}
                productName={productName}
                productImage={shareImage} // Use the derived share image
                productDescription={product.description || ''} // Use description
             />
          </div>
        </div>
      </div> {/* End Main Grid */}

      {/* Tabs Section */}
      <div className="mt-16 border-t pt-8">
        <div className="flex border-b border-gray-200 mb-6 justify-center">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${selectedTab === "longDescription" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-500 hover:text-gray-800"}`}
            onClick={() => handleTabClick("longDescription")}
          >
            Description
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${selectedTab === "reviews" ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-500 hover:text-gray-800"}`}
            onClick={() => handleTabClick("reviews")}
          >
            Reviews ({reviews.length}) {/* Dynamic count */}
          </button>
          {/* Add more tabs if needed (e.g., Shipping Info) */}
        </div>

        {/* Tab Content */}
        <div className="p-1 min-h-[200px]"> {/* Added min-height */}
          {selectedTab === "longDescription" && (
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed"> {/* Use Tailwind Prose for styling */}
              {/* Use longDescription field from Sanity if it exists */}
              {product.longDescription ? (
                 <p>{product.longDescription}</p> // Render actual long description
              ) : (
                 <p>Detailed description not available for this product.</p> // Fallback
              )}
               {/* Add more detailed content here */}
            </div>
          )}

          {selectedTab === "reviews" && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={review.id || index} className="p-4 border rounded-lg bg-gray-50">
                       <div className="flex justify-between items-center mb-2">
                           <p className="font-semibold text-gray-800">{review.user}</p>
                           {/* Static stars - replace with review.rating */}
                           <div className="flex text-yellow-500">
                               {[...Array(5)].map((_, i) => <FaStar key={i} size={14}/>)}
                           </div>
                       </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No reviews yet.</p>
              )}

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="mt-8 pt-6 border-t">
                <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="reviewUser" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input id="reviewUser" type="text" value={newReview.user} onChange={(e) => setNewReview({ ...newReview, user: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required/>
                    </div>
                    <div>
                        <label htmlFor="reviewRating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <select id="reviewRating" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-white" required>
                            <option value="0" disabled>Select Rating</option>
                            {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="mb-4">
                     <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                     <textarea id="reviewComment" value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" required/>
                 </div>
                <button type="submit" className="px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded shadow hover:bg-orange-600 transition duration-200">Submit Review</button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products Section */}
      <div className="mt-16 border-t pt-8">
         <SimilarProductsSection currentProductId={product._id} />
      </div>

    </motion.div>
  );
};

export default ProductDetails;