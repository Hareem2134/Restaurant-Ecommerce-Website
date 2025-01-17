import React from 'react';
import ForAllHeroSections from '../../../components/ForAllHeroSections';
import Image from "next/image";

const chefs = [
  { name: "Tahmina Rumi", role: "Chef", image: "/pic1.png" },
  { name: "Jorina Begum", role: "Chef", image: "/pic2.png" },
  { name: "M. Mohammad", role: "Chef", image: "/pic3.png" },
  { name: "Munna Kathy", role: "Chef", image: "/pic4.png" },
  { name: "Tahmina Rumi", role: "Chef", image: "/pic5.png" },
  { name: "Bisnu Devgon", role: "Chef", image: "/pic6.png" },
  { name: "Motin Molladst", role: "Chef", image: "/pic7.png" },
  { name: "William Rumi", role: "Chef", image: "/pic8.png" },
  { name: "Kets William Roy", role: "Chef", image: "/pic9.png" },
  { name: "Mahmud Kholil", role: "Chef", image: "/pic10.png" },
  { name: "Ataur Rahman", role: "Chef", image: "/pic11.png" },
  { name: "Monalisa Holly", role: "Chef", image: "/pic12.png" },
];

export default function OurChef() {
  return (
    <div>
      <ForAllHeroSections />
      <div className="px-40 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {chefs.map((chef, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              {/* Chef Image */}
              <div className="relative h-56">
                <Image
                  src={chef.image}
                  alt={chef.name}
                  fill
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Chef Info */}
              <div className="text-center py-4">
                <h3 className="text-gray-800 font-semibold text-lg">{chef.name}</h3>
                <p className="text-gray-600">{chef.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
