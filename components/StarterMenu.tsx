import Image from "next/image";

interface MenuItem {
    name: string;
    description: string;
    calories: number;
    price: number;
    highlight?: boolean;
  }
  
  export const menuItems: MenuItem[] = [
    {
      name: "Alder Grilled Chinook Salmon",
      description: "Toasted French bread topped with romano, cheddar",
      calories: 560,
      price: 32,
    },
    {
      name: "Berries and creme tart",
      description: "Gorgonzola, ricotta, mozzarella, taleggio",
      calories: 700,
      price: 43,
      highlight: true,
    },
    {
      name: "Tormentoso Bush Pizza Pintoage",
      description: "Ground cumin, avocados, peeled and cubed",
      calories: 1000,
      price: 14,
    },
    {
      name: "Spicy Vegan Potato Curry",
      description: "Spreadable cream cheese, crumbled blue cheese",
      calories: 560,
      price: 35,
    },
  ];


  export default function StarterMenu() {
    return (
      <section className="w-full mx-auto mt-[80px] sm:mt-[120px] px-8 pl-32">
        <div className="container mx-auto py-16 flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-[400px]">
            <Image
              src="/menu.png"
              alt="Starter dish"
              className="w-[400px] h-[550px] rounded-lg shadow-md object-cover"
              width={400} height={550}
            />
          </div>
  
          {/* Menu Content */}
          <div className="w-full lg:w-1/2">
            {/* Heading with Coffee Icon */}
            <div className="mb-10 text-center lg:text-left">
              <Image
                src="/Coffee.png"
                alt="Coffee Icon"
                className="mx-auto lg:mx-0 mb-3"
                width={28} height={28}
              />
              <h2 className="text-4xl font-bold text-gray-100 tracking-wide">
                Starter Menu
              </h2>
            </div>
  
            {/* Menu Items */}
            <div className="space-y-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-dashed border-gray-300 pb-6"
                >
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-base font-semibold text-[#FF9F0D]`}
                    >
                      {item.name}
                    </h3>
                    <span className="text-base font-bold text-[#FF9F0D]">
                      {item.price}$
                    </span>
                  </div>
                  <p className="text-sm text-gray-100 mt-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-100 mt-1">
                    {item.calories} CAL
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  