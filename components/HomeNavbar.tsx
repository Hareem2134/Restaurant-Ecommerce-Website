"use client";
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";

const HomeNavbar: React.FC = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);

  const userTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle dropdown open/close with timeouts
  const handleMouseEnter = (setter: Dispatch<SetStateAction<boolean>>) => {
    if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setter(true);
  };

  const handleMouseLeave = (
    setter: Dispatch<SetStateAction<boolean>>,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    timeoutRef.current = setTimeout(() => setter(false), 300);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (userTimeoutRef.current) clearTimeout(userTimeoutRef.current);
      if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    };
  }, []);

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
            <Link href="/" className="hover:text-[#FF9F0D] transition">
              Home
            </Link>
            <Link href="/MenuPage" className="hover:text-[#FF9F0D] transition">
              Menu
            </Link>
            <Link href="/Blog" className="hover:text-[#FF9F0D] transition">
              Blog
            </Link>
            <Link href="/Pages" className="hover:text-[#FF9F0D] transition">
              Pages
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter(setIsAboutDropdownOpen)}
              onMouseLeave={() =>
                handleMouseLeave(setIsAboutDropdownOpen, aboutTimeoutRef)
              }
            >
              <button className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0">
                About ▼
              </button>
              {isAboutDropdownOpen && (
                <div className="absolute top-full left-0 bg-black text-white py-4 px-6 rounded-md shadow-md space-y-2 w-40 z-50">
                  <Link href="/About" className="block hover:text-[#FF9F0D]">
                    About Us
                  </Link>
                  <Link href="/OurChef" className="block hover:text-[#FF9F0D]">
                    Our Chef
                  </Link>
                  <Link href="/FAQ" className="block hover:text-[#FF9F0D]">
                    FAQ
                  </Link>
                </div>
              )}
            </div>

            <Link href="/Shop" className="hover:text-[#FF9F0D] transition">
              Shop
            </Link>
            <Link href="/Contact" className="hover:text-[#FF9F0D] transition">
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Section: User and Basket Icons */}
        <div className="flex items-center space-x-6">
          {/* Search Icon */}
          <button className="relative">
            <Image
              src="/Search.png"
              alt="Search"
              className="h-6 w-6"
              width={24}
              height={24}
            />
          </button>

          {/* User Icon with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter(setIsUserDropdownOpen)}
            onMouseLeave={() =>
              handleMouseLeave(setIsUserDropdownOpen, userTimeoutRef)
            }
          >
            <button className="flex items-center">
              <Image
                src="/user.png"
                alt="user"
                className="h-6 w-6 cursor-pointer"
                width={24}
                height={24}
              />
              <span className="ml-1 text-sm">▼</span>
            </button>

            {isUserDropdownOpen && (
              <div className="absolute bg-black text-white py-2 mt-2 rounded-md shadow-lg right-0">
                <Link
                  href="/Login"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black"
                >
                  Login
                </Link>
                <Link
                  href="/Signup"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black"
                >
                  Signup
                </Link>
                <Link
                  href="/Checkout"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black"
                >
                  Checkout
                </Link>
                <Link
                  href="/ShopDetails"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black"
                >
                  Shop Details
                </Link>
                <Link
                  href="/Shoplist"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black"
                >
                  Shop List
                </Link>
                <Link
                  href="/Logout"
                  className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Basket Icon */}
          <button className="relative">
            <Image
              src="/Handbag.png"
              alt="Basket"
              className="h-6 w-6"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
