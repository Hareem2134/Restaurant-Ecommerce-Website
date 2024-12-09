import React from 'react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div>

      <hr className="border-t border-gray-300"/>

      <div className="container mx-28 flex mt-5">

        <div className="w-1/6 border-r border-gray-300 pr-7">
          <ul className="space-y-3 text-gray-700 font-semibold">
            <li className="flex justify-between items-center hover:text-black cursor-pointer">
              Woman's Fashion <span className='text-2xl font-bold'>›</span>
            </li>
            <li className="flex justify-between items-center hover:text-black cursor-pointer">
              Men's Fashion <span className='text-2xl font-bold'>›</span>
            </li>
            <li className="hover:text-black cursor-pointer">Electronics</li>
            <li className="hover:text-black cursor-pointer">Home & Lifestyle</li>
            <li className="hover:text-black cursor-pointer">Medicine</li>
            <li className="hover:text-black cursor-pointer">Sports & Outdoor</li>
            <li className="hover:text-black cursor-pointer">Baby's & Toys</li>
            <li className="hover:text-black cursor-pointer">Groceries & Pets</li>
            <li className="hover:text-black cursor-pointer">Health & Beauty</li>
          </ul>
        </div>

        <hr className="border-t border-gray-300"/>

        <div className="w-892 h-334 mx-10">
          <Image src="/Hero-Image.png" alt="Hero Section" className="shadow-lg"/>
        </div>
      </div>
    </div>
  );
}
