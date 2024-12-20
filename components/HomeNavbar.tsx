"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const HomeNavbar: React.FC = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const aboutDropdownRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  // Handle clicks outside dropdowns or mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        aboutDropdownRef.current &&
        !aboutDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAboutDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="bg-black text-white relative">
      {/* Foodtruck Heading */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <span className="text-3xl font-bold text-[#FF9F0D]">
          Food<span className="text-white">tuck</span>
        </span>
      </div>

      {/* Navigation Bar */}
      <div className="container mx-auto flex justify-between items-center py-12 px-6">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <nav
          ref={navRef}
          className={`${
            isMobileMenuOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-black shadow-lg lg:flex lg:static lg:bg-transparent lg:w-auto lg:shadow-none lg:items-center z-50 opacity-95`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 w-full lg:w-auto">
            <Link href="/" className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]">
              Home
            </Link>
            <Link href="/MenuPage" className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]">
              Menu
            </Link>
            <Link href="/Blog" className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]">
              Blog
            </Link>
            <Link href="/Pages" className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]">
              Pages
            </Link>

            {/* About Dropdown */}
            <div ref={aboutDropdownRef} className="relative">
              <button
                className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
                onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
              >
                About ▼
              </button>
              {isAboutDropdownOpen && (
                <div className="absolute left-0 top-full bg-black text-white py-4 px-6 rounded-md shadow-md space-y-2 w-40">
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

            <Link href="/Shop" className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]">
              Shop
            </Link>
            <Link href="/Contact" className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]">
              Contact
            </Link>
          </div>
        </nav>

        {/* Right Section: User and Basket Icons */}
        <div className="flex items-center space-x-6">
          {/* Search Icon */}
          <button className="relative">
            <Image src="/Search.png" alt="Search" className="h-6 w-6" width={24} height={24} />
          </button>

          {/* User Icon with Dropdown */}
          <div ref={userDropdownRef} className="relative inline-block">
            <button className="flex items-center" onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
              <Image src="/user.png" alt="user" className="h-6 w-6 cursor-pointer" width={24} height={24} />
              <span className="ml-1 text-sm">▼</span>
            </button>

            {isUserDropdownOpen && (
              <div className="absolute bg-black text-white py-2 mt-2 rounded-md shadow-lg right-0 z-50">
                <Link href="/Login" className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black">
                  Login
                </Link>
                <Link href="/Signup" className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black">
                  Signup
                </Link>
                <Link href="/Checkout" className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black">
                  Checkout
                </Link>
                <Link href="/ShopDetails" className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black">
                  Shop Details
                </Link>
                <Link href="/Shoplist" className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black">
                  Shop List
                </Link>
                <Link href="/Logout" className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black">
                  Logout
                </Link>
              </div>
            )}
          </div>

          {/* Basket Icon */}
          <button className="relative">
            <Image src="/Handbag.png" alt="Basket" className="h-6 w-6" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbar;
