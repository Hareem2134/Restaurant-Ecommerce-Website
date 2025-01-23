"use client"
import React from "react";

const SocialMediaSharing: React.FC = () => {
  const handleShare = (platform: string) => {
    alert(`Sharing on ${platform}!`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Social Media Sharing</h2>
      <div className="flex gap-4">
        <button
          onClick={() => handleShare("Facebook")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Share on Facebook
        </button>
        <button
          onClick={() => handleShare("Twitter")}
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Share on Twitter
        </button>
        <button
          onClick={() => handleShare("WhatsApp")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default SocialMediaSharing;
