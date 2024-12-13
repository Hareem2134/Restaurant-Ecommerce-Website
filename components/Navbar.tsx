"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ref to store dropdown timeout
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse enter to open dropdown immediately
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  // Handle mouse leave to close dropdown with a delay
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  // Toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  // Skip rendering the navbar on the homepage
  if (isHomePage) {
    return null;
  }

  return (
    <header className="bg-black text-white py-4 px-6 sm:px-10 lg:px-[60px] xl:px-[100px] flex items-center justify-between">
      {/* Left Section - Logo */}
      <div className="flex items-center">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-[#FF9F0D]">
          Food<span className="text-white">tuck</span>
        </h1>
      </div>

      {/* Hamburger Icon for Mobile */}
      <button
        className="lg:hidden text-white text-2xl focus:outline-none"
        onClick={toggleMobileMenu}
        aria-label="Toggle Mobile Menu"
      >
        ☰
      </button>

      {/* Navigation Links */}
      <nav
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:flex lg:space-x-8 text-[16px] relative flex-col lg:flex-row lg:static top-full left-0 w-full lg:w-auto bg-black lg:bg-transparent lg:z-auto z-50`}
      >
        {[
          { label: "Home", path: "/" },
          { label: "Menu", path: "/MenuPage" },
          { label: "Blog", path: "/Blog" },
          { label: "Pages", path: "/Pages" },
          { label: "Shop", path: "/Shop" },
          { label: "Contact", path: "/Contact" },
        ].map((link) => (
          <Link
            key={link.label}
            href={link.path}
            className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0"
          >
            {link.label}
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
            width={28}
            height={28}
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
            width={28}
            height={28}
            className="cursor-pointer"
          />▼
          {isDropdownOpen && (
            <div
              className="absolute top-full right-0 mt-2 bg-white text-black py-4 px-6 rounded-md shadow-md space-y-2 w-40"
              style={{
                position: "absolute", // Keeps dropdown in place relative to parent
                opacity: 0.95, // Semi-transparent background
                zIndex: 50, // Ensures it overlaps other content
              }}
            >
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
            width={28}
            height={28}
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
