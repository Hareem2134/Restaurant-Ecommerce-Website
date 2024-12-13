"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const footer1 = "/footer1.png";
const footer2 = "/footer2.png";
const footer3 = "/footer3.png";

const Footer = () => {
  return (
    <footer className="bg-black text-white relative">
      {/* Upper Footer Section */}
      <div className="bg-black text-white py-10 px-6 md:px-[135px] flex flex-col md:flex-row items-center justify-between">
        {/* Text Section */}
        <div className="text-center md:text-left md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-[20px] md:text-[32px] font-semibold">
            <span className="text-[#FF9F0D]">St</span>ill You Need Our Support?
          </h2>
          <p className="text-[12px] md:text-[16px] font-normal mt-4">
            Don't wait, make a smart & logical quote here. It's pretty easy.
          </p>
        </div>

        {/* Input and Button Section */}
        <div className="flex flex-col md:flex-row items-center w-full md:w-auto gap-4 md:gap-2">
          <input
            type="text"
            placeholder="Enter Your Email"
            className="bg-[#FF9F0D] text-white placeholder-white py-3 px-4 md:py-4 md:px-6 text-sm md:text-base w-full md:w-auto"
          />
          <button className="bg-white text-[#FF9F0D] py-3 px-4 md:py-4 md:px-6 text-sm md:text-base font-semibold">
            Subscribe Now
          </button>
        </div>
      </div>

      {/* Horizontal line */}
      <hr className="my-4 mx-auto w-3/4 border-[#FF9F0D]" />

      <div className="mx-auto w-full max-w-screen-xl px-6 md:px-[135px] py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* About Us */}
          <div className="text-center">
            <h2 className="mb-6 text-[24px] font-semibold uppercase">About Us</h2>
            <p className="text-[#FFFFFF] text-[16px] font-normal">
              Corporate clients and leisure travelers rely on Groundlink for dependable, safe, and professional chauffeured car service in major cities across the world.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="bg-[#FF9F0D] w-[50px] h-[50px] flex justify-center items-center"> {/* Smaller box */}
                <Image src="/ClockClockwise.png" alt="Clock" width={40} height={40} />
              </div>
              <div>
                <h3 className="text-[16px] text-[#FFFFFF] font-normal">Opening Hours</h3>
                <p className="text-[10px] text-[#FFFFFF]">Mon - Sat (8:00 - 18:00)</p>
                <p className="text-[10px] text-[#FFFFFF]">Sunday - Closed</p>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="text-center">
            <h2 className="mb-6 text-[24px] font-semibold uppercase">Useful Links</h2>
            <ul className="text-gray-500 font-medium">
              <li className="mb-4"><Link href="#">About</Link></li>
              <li className="mb-4"><Link href="#">News</Link></li>
              <li className="mb-4"><Link href="#">Partners</Link></li>
              <li className="mb-4"><Link href="#">Team</Link></li>
              <li className="mb-4"><Link href="#">Menu</Link></li>
              <li className="mb-4"><Link href="#">Contacts</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="text-center">
            <h2 className="mb-6 text-[24px] font-semibold uppercase">Help?</h2>
            <ul className="text-gray-500 font-medium">
              <li className="mb-4"><Link href="#">FAQ</Link></li>
              <li className="mb-4"><Link href="#">Terms & Conditions</Link></li>
              <li className="mb-4"><Link href="#">Reporting</Link></li>
              <li className="mb-4"><Link href="#">Documentation</Link></li>
              <li className="mb-4"><Link href="#">Support Policy</Link></li>
              <li className="mb-4"><Link href="#">Privacy</Link></li>
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="text-center">
            <h2 className="mb-6 text-[24px] font-semibold uppercase">Recent Posts</h2>
            <ul>
              {[footer1, footer2, footer3].map((img, index) => (
                <li key={index} className="flex items-center gap-4 mb-4">
                  <Image src={img} alt={`Post ${index + 1}`} width={64} height={64} />
                  <div>
                    <p className="text-[12px] text-[#FFFFFF]">20 Feb 2022</p>
                    <p className="text-[14px] font-normal text-[#FFFFFF]">Keep Your Business</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-[#FF9F0D] py-4 px-6 md:px-[135px] flex justify-between items-center relative">
        <p className="text-white text-sm">Copyright © 2023. All Rights Reserved.</p> {/* Smaller and white text */}
        <div className="flex gap-4 ml-[-50px] md:ml-0">
          {["Facebook", "Twitter", "Instagram", "YouTube", "Pinterest"].map((icon, idx) => (
            <div key={idx} className="bg-white w-8 h-8 flex items-center justify-center rounded-md"> {/* Square box, smaller size */}
              <Image src={`/${icon}.png`} alt={icon} width={14} height={14} />
            </div>
          ))}
        </div>
        <Image
          src="/Leaves.png"
          alt="Leaves"
          width={150}
          height={150}
          className="absolute bottom-0 right-0"
        />
      </div>
    </footer>
  );
};

export default Footer;
