import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "../../components/Footer";
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
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DynamicNavbar>
          {children}
          <Footer />
        </DynamicNavbar>
      </body>
    </html>
  );
}
