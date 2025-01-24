"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import HomeNavbar from "./HomeNavbar";
import LanguageSwitcher from "components/LanguageSelector";

const DynamicNavbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="text-white justify-around">
      {/* Pass LanguageSwitcher as a prop */}
      {pathname === "/" ? (
        <HomeNavbar>
          <LanguageSwitcher />
        </HomeNavbar>
      ) : (
        <Navbar>
          <LanguageSwitcher />
        </Navbar>
      )}
    </nav>
  );
};

export default DynamicNavbar;
