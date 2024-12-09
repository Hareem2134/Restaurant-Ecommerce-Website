import Image from 'next/image';
import React from 'react';

export const ExperienceItem = [
  {
    src: "/cap.png",
    value: "420",
    label: "Professional Chefs",
  },
  {
    src: "/burger.png",
    value: "320",
    label: "Items Of Food",
  },
  {
    src: "/spoon.png",
    value: "30+",
    label: "Years Of Experienced",
  },
  {
    src: "/pizza.png",
    value: "220",
    label: "Happy Customers",
  },
];

export default function Experience() {
  return (
    <section
      className="relative h-[469px] w-full bg-cover bg-center bg-[url('/experience-background.png')]"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-85"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-center">
          {ExperienceItem.map((item, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center space-y-4"
            >
              {/* Icon */}
              <div>
                <Image
                  src={item.src}
                  alt={item.label}
                  width={120}
                  height={120}
                  className="mb-4"
                />
              </div>

              {/* Text */}
              <p className="text-sm sm:text-base lg:text-lg font-medium text-white">
                {item.label}
              </p>

              {/* Value */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                {item.value}
              </h3>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
