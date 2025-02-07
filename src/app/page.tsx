"use client";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Lazy loading non-critical components
const FoodCategory = dynamic(() => import("../../components/FoodCategory"), { ssr: false });
const HeroAboutus = dynamic(() => import("../../components/HeroAboutus"), { ssr: false });
const HomePageExperience = dynamic(() => import("../../components/HomePageExperience"), { ssr: false });
const ChefOnHome = dynamic(() => import("../../components/ChefOnHome"), { ssr: false });
const SimilarProductsSection = dynamic(() => import("components/SimilarProducts"), { ssr: false });

function HomePage() {
  return (
    <>
      <section className="bg-black px-3 md:px-[135px] flex flex-col justify-evenly md:flex-row md:items-center py-[50px]">
        {/* Text Content */}
        <div className="text-white w-full md:w-[50%]">
          <h1 className="md:text-[32px] text-[24px] font-normal text-[#FF9F0D]">
            It's Quick & Amusing!
          </h1>
          <h1 className="text-[25px] md:text-[50px] font-bold">
            <span className="text-[#FF9F0D]">Th</span>e Art of Speed Food Quality
          </h1>
          <p className="text-[10px] md:text-[16px] font-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius sed pharetra dictum neque massa congue.
          </p>
          <div className="flex flex-col md:flex-row items-center">
            <button className="bg-[#FF9F0D] text-white w-[100px] h-[30px] md:w-[190px] md:h-[60px] rounded-[40px] mt-[32px] hover:bg-yellow-800">
              See More
            </button>
          </div>
        </div>

        {/* Optimized Image */}
        <div className="mt-[50px] md:mt-0">
          <Image
            src="/hero.webp"
            alt="Hero Image"
            width={700}
            height={500}
            priority // Loads immediately for better LCP
            placeholder="blur" // Uses a low-quality placeholder
            blurDataURL="/hero-lowres.jpg" // Add a low-res version for better UX
            sizes="(max-width: 768px) 100vw, 700px"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Lazy-loaded sections to improve initial load speed */}
      <HeroAboutus />
      <SimilarProductsSection currentProductId={"product._id"} />
      <FoodCategory />
      <HomePageExperience />
      <ChefOnHome />
    </>
  );
}

export default HomePage;
