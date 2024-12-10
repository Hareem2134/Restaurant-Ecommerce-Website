"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // New hook for pathname

const Navbar = () => {
  const pathname = usePathname(); // Current route

  // Hide navbar if on the homepage
  const isHomePage = pathname === "/";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Use a ref to store the timeout
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current); // Clear timeout if already set
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200); // Adjust the delay as needed
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current); // Cleanup timeout on unmount
    };
  }, []); // Empty dependency array since we're using refs

  if (isHomePage) {
    return null; // Skip rendering the navbar on the homepage
  }

  return (
    <header className="bg-black text-white py-4 px-6 sm:px-10 lg:px-[60px] xl:px-[100px] flex items-center justify-between">
      {/* Left Section - Logo */}
      <div className="flex items-center">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-[#FF9F0D]">
          Food<span className="text-white">tuck</span>
        </h1>
      </div>

      {/* Middle Section - Navigation */}
      <nav className="hidden lg:flex space-x-8 text-[16px] relative">
        {[
          { label: "Home", path: "/" },
          { label: "Menu", path: "/MenuPage" },
          { label: "Blog", path: "/Blog" },
          { label: "Pages", path: "/Pages" },
          { label: "Shop", path: "/Shop" },
          { label: "Contact", path: "/Contact" },
        ].map((link) => (
          <Link key={link.label} href={link.path} className="relative text-white transition">
            {link.label}
            {/* Dot Effect */}
            <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 rounded-full bg-[#FF9F0D] scale-0 hover:scale-100 transition-transform"></span>
          </Link>
        ))}
      </nav>

      {/* Right Section - Icons */}
      <div className="flex items-center space-x-4">
        {/* Search Icon */}
        <Link href="/">
          <Image
            src="/Search.png"
            alt="Search Icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </Link>

        {/* User Icon with Dropdown */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            src="/User.png"
            alt="User Icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white text-black py-4 px-6 rounded-md shadow-md space-y-2 w-40">
              <Link href="/Login" className="block hover:text-[#FF9F0D]">
                Login
              </Link>
              <Link href="/Signup" className="block hover:text-[#FF9F0D]">
                Signup
              </Link>
              <Link href="/Checkout" className="block hover:text-[#FF9F0D]">
                Checkout
              </Link>
              <Link href="/ShopDetails" className="block hover:text-[#FF9F0D]">
                Shop Details
              </Link>
              <Link href="/Shoplist" className="block hover:text-[#FF9F0D]">
                Shop List
              </Link>
            </div>
          )}
        </div>

        {/* Basket Icon */}
        <Link href="/Cart" className="relative">
          <Image
            src="/Handbag.png"
            alt="Basket Icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
