import React from "react";

const BlogCardOnBlog = ({ image, title, description }: any) => {
  return (
    <div className="overflow-hidden pb-4">
      {/* Blog Image with Date Overlay */}
      <div className="relative">
        <img src={image} alt={title} className="w-full h-[300px] object-cover" />
        <div className="absolute top-3 left-3 bg-[#FF9F0D] text-white text-xs font-semibold rounded-md px-2 py-1 text-center w-12">
          <span className="block text-base">14</span>
          <span className="block text-xs">Feb</span>
        </div>
      </div>

      {/* Blog Details */}
      <div className="p-0 pl-0 pr-8 pt-3">
        {/* Date and Details Section */}
        <div className="flex items-center text-sm text-gray-100 space-x-4 mb-3 pl-0">
          <span className="flex items-center">
            <img src="/CalendarOnBlog.png" alt="Calendar Icon" className="w-4 h-4 mr-1" />
            Feb 14, 2022
          </span>
          <span className="flex items-center">
            <img src="/CommentsOnBlog.png" alt="Comments Icon" className="w-4 h-4 mr-1" />
            3
          </span>
          <span className="flex items-center">
            <img src="/AdminOnBlog.png" alt="Admin Icon" className="w-4 h-4 mr-1" />
            Admin
          </span>
        </div>

        {/* Blog Title */}
        <h2 className="text-lg font-bold text-gray-100 leading-6 mb-5 pl-0">{title}</h2>

        {/* Horizontal Line */}
        <hr className="border-t border-gray-300 mb-5 mr-6" />

        {/* Blog Description */}
        <p className="text-xs text-gray-100 leading-5 pl-0 pr-16">{description}</p>

        {/* Read More Button */}
        <a
          href="#"
          className="inline-flex items-center text-[#FF9F0D] border border-[#FF9F0D] font-medium px-4 py-2 rounded-md hover:bg-[#FF9F0D] hover:text-white transition-all mt-4"
        >
          Read More
          <img src="/ArrowOnReadMoreButton.png" alt="Arrow" className="ml-2 w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default BlogCardOnBlog;
