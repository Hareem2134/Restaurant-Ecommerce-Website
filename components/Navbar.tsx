"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../src/app/Context/CartContext";
import { FaChevronDown } from "react-icons/fa";

interface NavbarProps {
  children?: React.ReactNode; // Accept children as a prop
}

interface BasketIconProps {
  totalCartItems: number;
}

const BasketIcon: React.FC<BasketIconProps> = ({ totalCartItems }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Link href="/Cart" className="relative">
      <Image
        src="/Handbag.png"
        alt="Basket Icon"
        width={28}
        height={28}
        className="transition-transform duration-200 hover:scale-125 cursor-pointer"
      />
      {isClient && totalCartItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#FF9F0D] text-black text-xs font-bold rounded-full px-2 py-1">
          {totalCartItems}
        </span>
      )}
    </Link>
  );
};

const Navbar: React.FC<NavbarProps> = ({ children }) => {

  const router = useRouter();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState({
    user: false,
    about: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRefs = {
    user: useRef<HTMLDivElement | null>(null),
    about: useRef<HTMLDivElement | null>(null),
  };

  const navRef = useRef<HTMLDivElement | null>(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/Shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleDropdown = (dropdown: "user" | "about") => {
    setIsDropdownOpen((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs).forEach((key) => {
        const ref = dropdownRefs[key as keyof typeof dropdownRefs];
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsDropdownOpen((prev) => ({ ...prev, [key]: false }));
        }
      });

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
      <div className="flex items-center">
        <h1 className="text-[28px] sm:text-[34px] font-bold text-[#FF9F0D]">
          Food<span className="text-white">tuck</span>
        </h1>
      </div>

      <nav
        ref={navRef}
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } absolute top-full left-0 w-full bg-black shadow-lg lg:flex lg:static lg:bg-transparent lg:w-auto lg:shadow-none lg:items-center z-50 opacity-95`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 w-full lg:w-auto">
          {[
            { label: "Home", path: "/" },
            { label: "Menu", path: "/MenuPage" },
            { label: "Blog", path: "/Blog" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
            >
              {link.label}
            </Link>
          ))}
          <div ref={dropdownRefs.about} className="relative">
            <button
              className="flex items-center py-4 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
              onClick={() => toggleDropdown("about")}
              aria-expanded={isDropdownOpen.about}
            >
              About <FaChevronDown className="ml-1 text-sm" />
            </button>
            {isDropdownOpen.about && (
              <div className="absolute bg-black text-white py-4 px-6 rounded-md shadow-md space-y-2 w-60">
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
          <Link
              href="/Shop"
              className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
            >
              Shop
            </Link>
            <Link
              href="/Contact"
              className="block lg:inline-block text-white py-2 lg:py-0 px-4 lg:px-0 hover:text-[#FF9F0D]"
            >
              Contact
            </Link>
          </div>
        </nav>


      <div className="flex items-center space-x-4">
        <form onSubmit={handleSearchSubmit} className="relative w-24 lg:w-48">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1.5 px-3 pr-10 bg-white text-black text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF9F0D] border border-gray-300"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#FF9F0D] text-white px-2 py-1 text-sm rounded-full"
          >
            Search
          </button>
        </form>

        <div ref={dropdownRefs.user} className="relative">
          <button
            className="flex items-center transition-transform duration-200 hover:scale-125"
            onClick={() => toggleDropdown("user")}
          >
            <Image
              src="/user.png"
              alt="User"
              className="cursor-pointer"
              width={24}
              height={24}
            />
            <FaChevronDown className="ml-1 text-sm" />
          </button>
          {isDropdownOpen.user && (
            <div className="absolute bg-black text-white py-2 mt-2 rounded-md shadow-lg right-0 z-50">
              {["Login", "Signup", "WishList", "Checkout", "Logout"].map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  className="block px-6 py-2 hover:bg-[#FF9F0D]"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>

        <BasketIcon totalCartItems={totalCartItems} />

        <button
          className="lg:hidden text-white text-2xl ml-4 focus:outline-none"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle Mobile Menu"
        >
          ☰
        </button>

        {/* Render children (e.g., LanguageSwitcher) */}
        {children}

      </div>
    </header>
  );
};

export default Navbar;