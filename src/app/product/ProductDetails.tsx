"use client";
import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { useCart } from "../Context/CartContext"; // Importing Cart Context

const ProductDetails = ({ product }: { product: any }) => {
  const { addToCart } = useCart(); // Using the addToCart function from Cart Context
  const [selectedImage, setSelectedImage] = useState(
    product.image?.asset?._ref ? urlFor(product.image.asset).url() : "/placeholder.jpg"
  );
  const [reviews, setReviews] = useState<any[]>(
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
  const [showPopup, setShowPopup] = useState(false);
  const [showGoToCart, setShowGoToCart] = useState(false); // State for the "Go to Cart" button

  const images = product.images || [];

  const handleAddToCart = () => {
    const cartItem = {
        id: product._id,
        name: product.name,
        price: product.price,
        image: selectedImage,
        quantity: 1,
    };

    addToCart(cartItem); // Add item to the global cart context
    setShowPopup(true); // Show success popup
    setShowGoToCart(true); // Display "Go to Cart" button
    setTimeout(() => setShowPopup(false), 1200); // Auto-hide popup after 1.2 seconds
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.user || !newReview.rating || !newReview.comment) {
      alert("All fields are required.");
      return;
    }

    setReviews([...reviews, { ...newReview, id: reviews.length + 1 }]);
    setNewReview({ user: "", rating: 0, comment: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-screen-lg px-6">
        {/* Success Popup */}
        {showPopup && (
          <div className="fixed top-4 right-4 z-50 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg flex items-center space-x-4">
            <span>{product.name} has been added to the cart!</span>
            <button
              onClick={() => setShowPopup(false)}
              className="text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        )}

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-6">
            <div
              className="relative w-full max-w-md h-96 mx-auto rounded-xl shadow-md overflow-hidden bg-white transform transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={selectedImage}
                alt={product.name}
                layout="fill"
                objectFit="contain"
                className="cursor-pointer"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex items-center justify-center space-x-3">
              {images.map((img: any, index: number) => {
                const imgUrl = img.asset?._ref ? urlFor(img.asset).url() : "/placeholder.jpg";
                return (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-lg overflow-hidden border cursor-pointer transform transition ${
                      selectedImage === imgUrl
                        ? "scale-110 border-green-600"
                        : "hover:scale-105 border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(imgUrl)}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${index}`} width={64} height={64} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-4xl text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>

            <div className="flex items-center space-x-2">
              {product.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-baseline space-x-6">
              <span className="text-3xl font-semibold text-green-600">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>

            <div className="flex space-x-4">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Add to Cart
              </button>

              {/* Go to Cart Button */}
              {showGoToCart && (
                <Link href="/Cart">
                  <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                  >
                    Go to Cart
                  </button>
                </Link>
              )}

              {/* Buy Now Button */}
              <Link href="/Checkout" className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition">
                Buy Now
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900">Customer Reviews</h2>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="p-6 bg-white shadow-lg rounded-lg transition hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-gray-800">{review.user}</p>
                    <div className="flex space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-yellow-500"
                        >
                          <path d="M12 .288l2.833 8.718h9.167l-7.417 5.396 2.834 8.718-7.417-5.397-7.417 5.397 2.834-8.718-7.417-5.396h9.167z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 mt-4">No reviews yet. Be the first to leave one!</p>
          )}

          {/* Add Review Form */}
          <form
            onSubmit={handleReviewSubmit}
            className="mt-8 p-6 bg-white shadow-lg rounded-lg space-y-6"
          >
            <h3 className="text-xl font-medium text-gray-900">Add a Review</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="user" className="block text-sm text-gray-700">
                  Your Name
                </label>
                <input
                  id="user"
                  type="text"
                  value={newReview.user}
                  onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm text-gray-700">
                  Rating
                </label>
                <select
                  id="rating"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="0">Select a rating</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r} Star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm text-gray-700">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
