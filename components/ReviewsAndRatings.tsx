"use client"
import React, { useState } from "react";

const ReviewsAndRatings: React.FC = () => {
  const [reviews, setReviews] = useState<string[]>([]);
  const [newReview, setNewReview] = useState<string>("");

  const handleAddReview = () => {
    setReviews([...reviews, newReview]);
    setNewReview("");
  };

  return (
    <div>
      <h2>Reviews & Ratings</h2>
      <div>
        {reviews.map((review, index) => (
          <p key={index}>{review}</p>
        ))}
      </div>
      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Write your review here..."
      ></textarea>
      <button onClick={handleAddReview}>Submit Review</button>
    </div>
  );
};

export default ReviewsAndRatings;
