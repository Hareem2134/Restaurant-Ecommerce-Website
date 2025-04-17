"use client"; // To use useRouter with Next.js 13+

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ForAllHeroSections = () => {
  const pathnameRaw = usePathname(); // Get current route path (string | null)

  // Provide a default value if pathnameRaw is null
  const pathname = pathnameRaw ?? "/"; // Default to homepage if null

  // Mapping of paths to display text
  const pageTitles: Record<string, string> = {
    "/": "Home",
    "/Shop": "Our Shop",
    "/Pages": "404 Error",
    "/Blog": "Our Blog",
    "/Contact": "Contact Us",
    "/MenuPage": "Our Menu",
    "/Checkout": "Checkout",
    "/About": "About Us",
    "/OurChef": "Our Chef",
    "/FAQ": "FAQ Page",
    "/Login": "SignIn Page",
    "/Signup": "SignUp Page",
    "/404": "404 Error",
    "/Shoplist": "Shop List",
    "/ShopDetails": "Shop Details",
    "/Cart": "Shopping Cart",
    "/Track": "Track Your Order",
    "/Order-Confirmation": "Order Confirmation", // Add confirmation page title
  } as const; // Use 'as const' if this mapping is static

  // Get current page title or default to "Page"
  const currentTitle = pageTitles[pathname as keyof typeof pageTitles] ?? // Assert type or check if key exists
                      (pathname === "/" ? "Home" : "Page"); // Fallback logic refined

  return (
    <section className="w-full bg-[url('/heropic.png')] bg-cover bg-no-repeat bg-center py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {/* Dynamic Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-white font-bold text-center mb-4 sm:mb-6">
            {currentTitle}
          </h1>

          {/* Breadcrumb Links */}
          <div className="text-base sm:text-lg md:text-xl flex gap-2 text-center justify-center">
            <Link href="/" className="text-white hover:text-[#FF9F0D] transition-colors duration-300">
              Home
            </Link>
            
            {/* Only show breadcrumb for non-home pages */}
            {pathname !== "/" && (
              <>
                <span className="text-white">/</span>
                {/* Link href uses the potentially null pathnameRaw for correctness */}
                <Link href={pathnameRaw ?? '#'} className="text-[#FF9F0D]">
                  {currentTitle}
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ForAllHeroSections;
