"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // For navigation
import { urlFor } from "@/sanity/lib/image";
import {
  FaStar,
  FaHeart,
  FaSyncAlt,
  FaArrowLeft,
  FaArrowRight, 
} from "react-icons/fa";
import { useCart } from "../Context/CartContext";
import { motion } from "framer-motion";
import SocialMediaSharing from "components/SocialMediaSharing";
import SimilarProductsSection from "components/SimilarProducts";

const ProductDetails = ({
  product,
  previousSlug,
  nextSlug,
}: {
  product: any;
  previousSlug: string | null;
  nextSlug: string | null;
}) => {
  const { addToCart } = useCart();
  const router = useRouter();
  
  // const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Default to the first image
  const [selectedTab, setSelectedTab] = useState("longDescription"); // Tab State
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState<string | null>(null);

  // Handle Tab Click
  const handleTabClick = (tab: string) => setSelectedTab(tab);


  const [reviews, setReviews] = useState(
    product.reviews?.length > 0
      ? product.reviews
      : [
          { id: 1, user: "John Doe", rating: 5, comment: "Excellent product!" },
          { id: 2, user: "Jane Smith", rating: 4, comment: "Very satisfied, works as expected." },
        ]
  );
  const [newReview, setNewReview] = useState({
    user: "",
    rating: 0,
    comment: "",
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.user || !newReview.rating || !newReview.comment) {
      alert("All fields are required.");
      return;
    }
    setReviews([...reviews, { ...newReview, id: reviews.length + 1 }]);
    setNewReview({ user: "", rating: 0, comment: "" });
  };



  // Get product images (with a fallback placeholder)
  const images = product?.images?.map((img: any) =>
    img.asset?._ref ? urlFor(img.asset).url() : "/placeholder.jpg"
  ) || ["/placeholder.jpg"];

  const [selectedImage, setSelectedImage] = useState<string | null>(
    product?.image?.asset?._ref
      ? urlFor(product.image.asset).url()
      : images[0]
  );

  // Automatic image transition interval
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSelectedImageIndex((prevIndex) => {
  //       const newIndex = (prevIndex + 1) % images.length;
  //       setSelectedImage(images[newIndex]); // Ensure selectedImage updates instantly
  //       return newIndex;
  //     });
  //   }, 5000); // Auto-switch every 5 seconds
  
  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, [images, selectedImageIndex]); // Ensure it re-runs when images change
  

  // Arrow key navigation
  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "ArrowRight" && selectedImageIndex < images.length - 1) {
  //       setSelectedImageIndex(selectedImageIndex + 1);
  //       setSelectedImage(images[selectedImageIndex + 1]);
  //     } else if (e.key === "ArrowLeft" && selectedImageIndex > 0) {
  //       setSelectedImageIndex(selectedImageIndex - 1);
  //       setSelectedImage(images[selectedImageIndex - 1]);
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => window.removeEventListener("keydown", handleKeyDown); // Cleanup
  // }, [selectedImageIndex, images]);

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      quantity,
    });
    showNotification(`${product.name} added to cart!`);
  };

  // Add to Wishlist
  const handleAddToWishlist = () => {
    if (typeof window === "undefined") return; // Prevent SSR issues

    const existingWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    if (!existingWishlist.some((item: any) => item.id === product._id)) {
      existingWishlist.push({
        id: product._id,
        name: product.name,
        image: selectedImage, // Use selectedImage instead of product.image
        price: product.price,
        originalPrice: product.originalPrice || null,
        availability: "In stock",
        quantity: 1,
      });

      localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
      showNotification(`${product.name} added to wishlist!`);
    } else {
      showNotification(`${product.name} is already in wishlist.`);
    }
    // Navigate to the Wishlist page
    router.push("/WishList");
  };

  // Add to Compare
  const handleAddToCompare = () => {
    if (typeof window === "undefined") return;

    const existingProducts = JSON.parse(localStorage.getItem("comparisonProducts") || "[]");

    if (!existingProducts.some((p: any) => p.id === product._id)) {
      existingProducts.push({
        id: product._id,
        name: product.name,
        image: selectedImage,
        price: product.price,
        category: product.category,
      });

      localStorage.setItem("comparisonProducts", JSON.stringify(existingProducts));
      showNotification(`${product.name} added to comparison list!`);
    } else {
      showNotification(`${product.name} is already in comparison.`);
    }
      // Navigate to the comparison page
      router.push("/Product-Comparison");
  };
  
    const showNotification = (message: string) => {
      setNotification(message);
      setTimeout(() => setNotification(null), 3000); // Auto-hide after 3 seconds
    };

    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const productName = product.name;
    const productImage = product.image ? urlFor(product.image).url() : "/default.jpg";

    const navigateToProduct = (slug: string | null) => {
      if (slug) {
        router.push(`/product/${slug}`);
      }
    };

    if (!product) {
      return <p>Loading product details...</p>;
    }

    return (
      <motion.div
      className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-36 py-10"
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      >

      {/* Notification */}
      {notification && (
        <div className="fixed top-15 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}

        <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Thumbnails Section */}
        <div className="lg:col-span-2 hidden lg:flex flex-col items-center">
          {images.map((imgUrl, index) => (
            <motion.div
              key={index}
              className={`w-full h-28 shadow-black shadow-md hover:shadow-black hover:shadow-lg rounded-lg overflow-hidden border cursor-pointer mb-6 ${
                selectedImage === imgUrl
                  ? "ring-1 ring-orange-500"
                  : "hover:opacity-95"
              }`}
              whileHover={{ scale: 1.10 }}
              onClick={() => {
                setSelectedImage(index);
                setSelectedImage(images[index]); // Ensure immediate update
              }}                        
            >
              <Image
                src={imgUrl}
                alt={`Thumbnail ${index + 1}`}
                width={110}
                height={110}
                className="object-cover w-full h-full hover:shadow-black hover:shadow-sm"
              />
            </motion.div>
          ))}
        </div>

        {/* Main Product Image */}
        <div className="lg:col-span-6 flex flex-col items-center relative">
          <motion.div 
            className="max-w-[80%] aspect-square lg:aspect-auto shadow-black hover:shadow-black hover:shadow-md" 
            whileHover={{ scale: 1.10 }} 
            transition={{ duration: 0.5 }}
          >
            <Image
              src={selectedImage || "/placeholder.jpg"} // Use selectedImage directly
              alt={product.name}
              layout="responsive"
              width={1}
              height={350}
              className="object-contain rounded shadow-black shadow-md hover:shadow-lg hover:shadow-black transition-transform"
              key={selectedImage} 
            />
          </motion.div>
        </div>

        {/* Product details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-center mb-1">
          <div className="text-xs sm:text-sm text-white bg-[#FF9F0D] px-3 py-0.5 sm:px-4 sm:py-1 rounded-lg font-semibold">
            In Stock
          </div>
            <div className="flex items-center space-x-2">
              <button
                className={`flex items-center text-orange-500 hover:underline ${
                  !previousSlug ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!previousSlug}
                onClick={() => navigateToProduct(previousSlug)}
              >
                <FaArrowLeft className="mr-2" />
                Previous
              </button>
              <button
                className={`flex items-center text-orange-500 hover:underline ${
                  !nextSlug ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!nextSlug}
                onClick={() => navigateToProduct(nextSlug)}
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold">{product.name}</h1>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed max-w-md">{product.description}</p>

          {/* Price */}
          <div className="flex items-baseline space-x-4">
            <span className="text-2xl font-semibold text-gray-800">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          {/* Review Stars */}
          <div className="flex items-center space-x-4 mb-1">
            <div className="flex text-yellow-600 space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </div>

          {/* Breadcrumbs */}
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-orange-500">
              Home
            </a>{" "}
            /{" "}
            <a href="/Shop" className="hover:text-orange-500">
              Shop
            </a>{" "}
            / <span className="text-gray-800 hover:text-orange-500">{product.name}</span>
          </nav>

          {/* Quantity Selector and Add to Cart */}
          <div className="flex items-center space-x-2 pb-1">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="px-4 py-2 text-md font-semibold"
              >
                -
              </button>
              <span className="px-2 py-2">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-lg font-semibold">
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-orange-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-orange-600 transition"
            >
              Add to Cart
            </button>
          </div>

          {/* Wishlist and Product Comparison */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:gap-1 md:gap-2 lg:gap-4 mb-1 text-sm pt-1">
            <button
              onClick={handleAddToWishlist}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 lg:-ml-2"
            >
              <FaHeart />
              <span>Add to Wishlist</span>
            </button>
            <button
              onClick={handleAddToCompare}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 lg:-ml-2"
            >
              <FaSyncAlt />
              <span>Add to Compare</span>
            </button>
          </div>

          {/* Product Meta */}
          <div className="text-sm text-gray-600 space-y-1 mb-1">
            <p>
              <span className="font-semibold">Category:</span> {product.category || "General"}
            </p>
            {product.tags && (
              <p>
                <span className="font-semibold">Tags:</span> {product.tags.join(", ")}
              </p>
            )}
          </div>

          {/* Social Media Sharing */}
          <SocialMediaSharing
              productUrl={productUrl}
              productName={productName}
              productImage={productImage} 
              productDescription={product.description}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16 px-16">
      <div className="flex border-b border-gray-300">
        <button
          className={`px-16 py-3 text-md font-semibold ${
            selectedTab === "longDescription"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => handleTabClick("longDescription")}
        >
          Description
        </button>
        <button
          className={`px-6 py-3 text-md font-semibold ${
            selectedTab === "reviews"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "text-gray-600"
          }`}
          onClick={() => handleTabClick("reviews")}
        >
          Reviews (24 Reviews)
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {selectedTab === "longDescription" ? (
          <p className="text-gray-700 text-sm leading-relaxed">
            {product.longDescription}
          </p>
        ) : (
          <div>
        <div className="mt-16">

        <h2 className="text-2xl font-semibold">Customer Reviews</h2>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {reviews.map((review, index) => (
              <div key={index} className="p-6 bg-white shadow-lg rounded-lg">
                <p className="text-lg font-medium">{review.user}</p>
                <div className="flex space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="mt-3">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to leave one!</p>
        )}
        
        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="mt-8 p-6 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-medium">Add a Review</h3>
          <label>Your Name</label>
          <input
            type="text"
            value={newReview.user}
            onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <label>Rating</label>
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="0">Select a rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
            ))}
          </select>
          <label>Comment</label>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button type="submit" className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg">
            Submit Review
          </button>
        </form>
        </div>

        </div>
        )}
        </div>
      </div>

          {/* Similar Products Section */}  
          <SimilarProductsSection currentProductId={product._id} />;

      </motion.div>


  );
};

export default ProductDetails;