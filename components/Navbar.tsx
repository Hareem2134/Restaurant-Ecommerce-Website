"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../src/app/Context/CartContext";
import { FaChevronDown } from "react-icons/fa";
import LanguageSelector from "./LanguageSelector";

interface BasketIconProps {
  totalCartItems: number;
}

const BasketIcon: React.FC<BasketIconProps> = ({ totalCartItems }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensuring client-side rendering
  }, []);

  return (
    <Link href="/Cart" className="relative">
      <Image
        src="/Handbag.png"
        alt="Basket Icon"
        width={28}
        height={28}
        className=" transition-transform duration-200 hover:scale-125 cursor-pointer"
      />
      {isClient && totalCartItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#FF9F0D] text-black text-xs font-bold rounded-full px-2 py-1">
          {totalCartItems}
        </span>
      )}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const aboutDropdownRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const { cart } = useCart(); // Access the cart context

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/Shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle outside clicks for dropdowns
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
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } absolute top-full left-0 w-full bg-black shadow-lg lg:flex lg:static lg:bg-transparent lg:w-auto lg:shadow-none lg:items-center z-50 opacity-95`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 w-full lg:w-auto">
          {[{ label: "Home", path: "/" }, { label: "Menu", path: "/MenuPage" }, { label: "Blog", path: "/Blog" }].map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
            >
              {link.label}
            </Link>
          ))}
          {/* About Dropdown */}
          <div ref={aboutDropdownRef} className="relative">
            <button
              className="flex lg:inline-block text-white py-4 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D] items-center"
              onClick={() => setIsAboutDropdownOpen((prev) => !prev)}
              aria-expanded={isAboutDropdownOpen}
              aria-label="Toggle About Dropdown"
            >
              About <FaChevronDown className="ml-1 inline text-sm transition-transform hover:rotate-180" />
            </button>
            {isAboutDropdownOpen && (
              <div className="absolute left-0 top-full bg-black text-white py-4 px-6 rounded-md shadow-md space-y-2 w-60">
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
          {/* Other Links */}
          {[{ label: "Shop", path: "/Shop" }, { label: "Contact", path: "/Contact" }].map((link) => (
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
        <form onSubmit={handleSearchSubmit} className="relative w-24 lg:w-48">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1.5 px-3 pr-10 bg-white text-black text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF9F0D] border border-gray-300"
          />
          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#FF9F0D] text-white px-2 py-1 text-sm rounded-full hover:bg-[#e88d0c] focus:outline-none focus:ring-2 focus:ring-[#FF9F0D]"
          >
            Search
          </button>
        </form>

        {/* User Dropdown */}
        <div ref={userDropdownRef} className="relative inline-block">
        <button
          className="flex items-center transition-transform duration-200 hover:scale-125"
          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
        >
          <Image
            src="/user.png"
            alt="user"
            className="cursor-pointer"
            width={24}
            height={24}
          />
          <FaChevronDown className="ml-1 text-sm transition-transform hover:rotate-180" />
        </button>

        {isUserDropdownOpen && (
          <div className="absolute bg-black text-white py-2 mt-2 rounded-md shadow-lg right-0 z-50">
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
              href="/Logout"
              className="block px-6 py-2 hover:bg-[#FF9F0D] hover:text-black"
            >
              Logout
            </Link>
          </div>
        )}
      </div>

        {/* Basket Icon */}
        <BasketIcon totalCartItems={totalCartItems} />

        <LanguageSelector/>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white text-2xl ml-4 focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle Mobile Menu"
        >
          ☰
        </button>

      </div>
    </header>
  );
};

export default Navbar;
