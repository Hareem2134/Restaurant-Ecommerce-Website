import React from "react";
import Image from "next/image";

function AboutUs() {
  return (
    <section className="bg-black px-5 md:px-10 lg:pl-[80px] lg:pr-[60px] xl:pl-[130px] xl:pr-[80px] py-10">
      {/* Heading and Images Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mx-auto max-w-[1200px]">

        {/* Text Section */}
        <div className="text-white lg:w-[48%] mb-8 lg:mb-0">
          {/* Image Heading */}
          <div className="mb-6">
            <Image
              src="/aboutus.png"
              alt="About Us"
              width={91}
              height={40}
              className="w-auto h-auto"
            />
          </div>

          {/* Subheading */}
          <h1 className="text-[16px] md:text-[24px] lg:text-[32px] font-bold leading-tight mb-4">
            <span className="text-[#FF9F0D]">We</span>{" "}
            <span className="text-white">Create the best foody product</span>
          </h1>

          {/* Description Paragraph */}
          <p className="text-[12px] md:text-[14px] lg:text-[16px] font-normal leading-relaxed mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque diam pellentesque bibendum non dui volutpat fringilla bibendum. Urna, elit augue urna, vitae feugiat pretium donec id elementum. Ultrices mattis sed vitae mus risus. Lacus nisi, et ac dapibus sit eu velit in consequat.
          </p>

          {/* List of Features */}
          <ul className="space-y-4">
            <li className="text-[12px] md:text-[14px] lg:text-[16px] font-normal flex items-center">
              <Image
                src="/checked.png"
                alt="check"
                width={20}
                height={20}
                className="mr-2"
              />
              Lacus nisi, et ac dapibus sit eu velit in consequat.
            </li>
            <li className="text-[12px] md:text-[14px] lg:text-[16px] font-normal flex items-center">
              <Image
                src="/checked.png"
                alt="check"
                width={20}
                height={20}
                className="mr-2"
              />
              Quisque diam pellentesque bibendum non dui volutpat fringilla.
            </li>
            <li className="text-[12px] md:text-[14px] lg:text-[16px] font-normal flex items-center">
              <Image
                src="/checked.png"
                alt="check"
                width={20}
                height={20}
                className="mr-2"
              />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </li>
          </ul>

          {/* Button */}
          <div className="mt-6">
            <button className="bg-[#FF9F0D] text-white px-5 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base hover:bg-yellow-800">
              See More
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex flex-col lg:w-[48%] justify-center items-center">
          {/* First Image */}
          <div className="relative w-full max-w-[400px] h-[180px] md:h-[230px] mb-4">
            <Image
              src="/foodpic1.png"
              alt="Food Image 1"
              className="object-cover w-full h-full rounded-t-md"
              layout="fill"
            />
          </div>

          {/* Two Images in Row */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-[400px]">
            <div className="relative w-full h-[140px] md:h-[180px]">
              <Image
                src="/foodpic2.png"
                alt="Food Image 2"
                className="object-cover w-full h-full rounded-md"
                layout="fill"
              />
            </div>
            <div className="relative w-full h-[140px] md:h-[180px]">
              <Image
                src="/foodpic3.png"
                alt="Food Image 3"
                className="object-cover w-full h-full rounded-md"
                layout="fill"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
