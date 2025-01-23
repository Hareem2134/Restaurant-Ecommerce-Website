"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import HomeNavbar from "./HomeNavbar";

const DynamicNavbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className=" text-white">
      {/* Render Navbar based on the path */}
      {pathname === "/" ? <HomeNavbar /> : <Navbar />}

    </nav>
  );
};

export default DynamicNavbar;
