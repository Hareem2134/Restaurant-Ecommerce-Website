"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "../src/app/Context/CartContext"; // Import Cart Context

const Navbar: React.FC = () => {
  const pathname = usePathname(); // Detect route changes
  const isHomePage = pathname === "/";

  const { cart } = useCart(); // Access cart from the context
  const basketCount = cart.reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const aboutDropdownRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns or menu on outside click
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

  if (isHomePage) {
    return null;
  }

  return (
    <header className="bg-black text-white py-4 px-6 sm:px-10 lg:px-[60px] xl:px-[100px] flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-[#FF9F0D]">
          Food<span className="text-white">tuck</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav
        ref={navRef}
        className={`${isMobileMenuOpen ? "block" : "hidden"} absolute top-full left-0 w-full bg-black shadow-lg lg:flex lg:static lg:bg-transparent lg:w-auto lg:shadow-none lg:items-center z-50 opacity-95`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 w-full lg:w-auto">
          {[
            { label: "Home", path: "/" },
            { label: "Menu", path: "/MenuPage" },
            { label: "Blog", path: "/Blog" },
            { label: "Pages", path: "/Pages" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
            >
              {link.label}
            </Link>
          ))}
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

          {[
            { label: "Shop", path: "/Shop" },
            { label: "Contact", path: "/Contact" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white text-2xl ml-4 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          ☰
        </button>

        {/* Search Icon */}
        <Link href="/">
          <Image src="/Search.png" alt="Search Icon" width={28} height={28} className="cursor-pointer" />
        </Link>

        {/* User Dropdown */}
        <div ref={userDropdownRef} className="relative">
          <button
            className="flex items-center hover:text-[#FF9F0D]"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <Image src="/user.png" alt="user" width={24} height={24} className="h-6 w-6 cursor-pointer" />
            <span className="ml-1 text-sm">▼</span>
          </button>
          {isUserDropdownOpen && (
            <div className="absolute bg-black text-white py-2 mt-2 rounded-md shadow-lg right-0">
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
              <Link href="/Logout" className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black">
                Logout
              </Link>
            </div>
          )}
        </div>

        {/* Basket Icon with Count */}
        <Link href="/Cart" className="relative">
          <Image src="/Handbag.png" alt="Basket Icon" width={28} height={28} className="cursor-pointer" />
          {basketCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {basketCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
