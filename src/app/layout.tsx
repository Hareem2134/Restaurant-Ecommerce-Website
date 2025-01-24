import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "../../components/Footer";
import { CartProvider } from "./Context/CartContext";
import DynamicNavbar from "../../components/DynamicNavbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FoodTuck",
  description: "Customized & International Cuisine Delivery Q-Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const defaultLanguage = "en";

  return (
    <html lang={defaultLanguage}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <DynamicNavbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
