"use client";
import React from "react";
import LanguageSwitcher from "components/LanguageSelector";
import { CartProvider } from "@/app/Context/CartContext";
import Navbar from "./Navbar";

export default function DynamicNavbar({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar>
        <LanguageSwitcher />
      </Navbar>
      {children}
    </CartProvider>
  );
};
