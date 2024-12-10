import Image from "next/image"

interface MenuItem {
    name: string
    description: string
    calories: number
    price: number
    highlight?: boolean
  }
  
  export const menuItems: MenuItem[] = [
    {
      name: "Fig and lemon cake",
      description: "Toasted French bread topped with romano, cheddar",
      calories: 560,
      price: 32
    },
    {
      name: "Creamy mascarpone cake",
      description: "Gorgonzola, ricotta, mozzarella, taleggio",
      calories: 700,
      price: 43,
      highlight: true
    },
    {
      name: "Pastry, blueberries, lemon juice",
      description: "Ground cumin, avocados, peeled and cubed",
      calories: 1000,
      price: 14
    },
    {
      name: "Pain au chocolat",
      description: "Spreadable cream cheese, crumbled blue cheese",
      calories: 560,
      price: 35
    }
  ]

  export default function DessertsOnMenu() {
    return (
      <section className="w-full mx-auto mt-[80px] sm:mt-[120px] px-8 pl-32">
        <div className="container mx-auto py-16 flex flex-col lg:flex-row gap-12 items-center">
          {/* Image Section */}
          <div className="w-full lg:w-[400px]">
            <Image
              src="/dessert.png"
              alt="Dessert dish"
              className="w-[400px] h-[550px] rounded-lg shadow-md object-cover"
              width={400} height={550}
            />
          </div>
  
          {/* Menu Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Heading with Coffee Icon */}
            <div className="mb-10">
              <Image
                src="/coffee.png"
                alt="Coffee Icon"
                className="w-10 h-10 mx-auto lg:mx-0 mb-3"
                width={10} height={10}
              />
              <h2 className="text-4xl font-bold text-gray-800 tracking-wide">
                Dessert Menu
              </h2>
            </div>
  
            {/* Menu Items */}
            <div className="space-y-8">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-dashed border-gray-300 pb-6"
                >
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-base font-semibold ${
                        item.highlight ? "text-[#FF9F0D]" : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <span className="text-base font-bold text-[#FF9F0D]">
                      {item.price}$
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
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
  