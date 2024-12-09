import React from "react";
import Link from "next/link";
import Image from "next/image";

const HomeNavbar = () => {
  return (
    <div className="bg-black text-white relative">
      {/* Foodtruck Heading */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <span className="text-3xl font-bold text-[#FF9F0D]">
          Food<span className="text-white">truck</span>
        </span>
      </div>

      {/* Navigation Bar */}
      <div className="container mx-auto flex justify-between items-center py-12 px-6">
        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <nav className="flex space-x-6 text-sm font-medium">
            <Link href="/" className="relative hover:text-[#FF9F0D] transition">
              Home
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[3px] bg-[#FF9F0D] rounded-full transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link href="/MenuPage" className="relative hover:text-[#FF9F0D] transition">
              Menu
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[3px] bg-[#FF9F0D] rounded-full transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link href="/Blog" className="relative hover:text-[#FF9F0D] transition">
              Blog
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[3px] bg-[#FF9F0D] rounded-full transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link href="/Pages" className="relative hover:text-[#FF9F0D] transition">
              Pages
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[3px] bg-[#FF9F0D] rounded-full transition-all duration-300 hover:w-full"></span>
            </Link>
            <div className="relative group">
              <Link href="#" className="relative hover:text-[#FF9F0D] transition">
                About ▼
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[3px] bg-[#FF9F0D] rounded-full transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute hidden group-hover:flex flex-col bg-black text-white py-2 mt-2 rounded-md shadow-lg">
                <Link href="/About" className="flex w-10 px-8 py-2 hover:bg-[#FF9F0D] hover:text-black">
                  About Us
                </Link>
                <Link href="/OurChef" className="flex w-10 px-8 py-2 hover:bg-[#FF9F0D] hover:text-black">
                  Our Chef
                </Link>
                <Link href="/FAQ" className="flex w-10 px-8 py-2 hover:text-[#FF9F0D]">
                FAQ
                </Link>
              </div>
            </div>

            <Link href="/Shop" className="relative hover:text-[#FF9F0D] transition">
              Shop
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[3px] bg-[#FF9F0D] rounded-full transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link href="/Contact" className="relative hover:text-[#FF9F0D] transition">
            Contact
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[3px] bg-[#FF9F0D] rounded-full transition-all duration-300 hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Search Bar and Basket */}
        <div className="flex items-center space-x-6">
          {/* Search Icon */}
          <button className="relative">
            <Image src="/Search.png" alt="Search" className="h-6 w-6" />
          </button>

          {/* Basket Icon */}
          <button className="relative">
            <Image src="/Handbag.png" alt="Basket" className="h-6 w-6 text-[#FF9F0D]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
