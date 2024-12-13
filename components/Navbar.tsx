"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const dropdownTimeoutRef = useRef<number | null>(null);
  const userDropdownTimeoutRef = useRef<number | null>(null);
  const aboutDropdownTimeoutRef = useRef<number | null>(null);

  // Handle mouse events for menu dropdown
  const handleMouseEnter = (setOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (dropdownTimeoutRef.current !== null) window.clearTimeout(dropdownTimeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    timeoutRef: React.MutableRefObject<number | null>
  ) => {
    timeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  // Toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current !== null) window.clearTimeout(dropdownTimeoutRef.current);
      if (userDropdownTimeoutRef.current !== null) window.clearTimeout(userDropdownTimeoutRef.current);
      if (aboutDropdownTimeoutRef.current !== null) window.clearTimeout(aboutDropdownTimeoutRef.current);
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
          Food<span className="text-white">truck</span>
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
          ].map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0"
            >
              {link.label}
            </Link>
          ))}

          {/* About Dropdown - Placed Between Pages and Shop */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter(setIsAboutDropdownOpen)}
            onMouseLeave={() => handleMouseLeave(setIsAboutDropdownOpen, aboutDropdownTimeoutRef)}
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

          {/* Continue with remaining links */}
          {[
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
          onMouseEnter={() => handleMouseEnter(setIsUserDropdownOpen)}
          onMouseLeave={() => handleMouseLeave(setIsUserDropdownOpen, userDropdownTimeoutRef)}
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
            <div className="absolute top-full right-0 mt-2 bg-white text-black py-4 px-6 rounded-md shadow-md space-y-2 w-40 z-50">
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
              <Link href="/Logout" className="block hover:text-[#FF9F0D]">
                Logout
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
