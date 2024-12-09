import React from 'react';
import Image from 'next/image';

const items = [
  { id: 1, Image: "/f1.png", label: "Save 50% on Fast Food" },
  { id: 2, Image: "/f2.png", label: "Delicious Burgers" },
  { id: 3, Image: "/f3.png", label: "Healthy Salads" },
  { id: 4, Image: "/f4.png", label: "Desserts" },
];

const FoodCategory = () => {
  return (
    <section
      className="bg-black text-white py-12 px-6 sm:px-10 lg:px-20 relative"
      style={{
        backgroundImage: 'url("/background-leaves.png")',
        backgroundPosition: 'right bottom',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="container mx-auto text-center">
        {/* Title */}
        <h2 className="text-[24px] sm:text-[30px] md:text-[36px] font-bold mb-8">
          <span className="text-orange-500">Choose</span> Food Item
        </h2>

        {/* Grid of food items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-lg overflow-hidden shadow-md bg-white"
            >
              {/* Food Item Image */}
              <div className="relative w-full">
                <Image
                  src={item.Image}
                  alt={item.label}
                  layout="responsive"
                  width={306}
                  height={329}
                  className="object-cover"
                />
              </div>

              {/* Overlay Label */}
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-60 px-4 py-2 text-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <span className="text-orange-500 font-medium text-sm md:text-base">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodCategory;
