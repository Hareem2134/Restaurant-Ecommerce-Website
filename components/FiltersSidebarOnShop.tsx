import React, { useState } from 'react';

export default function FiltersSidebarOnShop() {
  const latestProducts = [
    { id: 1, name: 'Pizza', price: 35, stars: 2, image: '/latestproduct.png', category: 'Pizza' },
    { id: 2, name: 'Cupcake', price: 15, stars: 2, image: '/latestproduct.png', category: 'Cupcake' },
    { id: 3, name: 'Cookies', price: 25, stars: 2, image: '/latestproduct.png', category: 'Cookies' },
    { id: 4, name: 'Burger', price: 45, stars: 2, image: '/latestproduct.png', category: 'Burger' },
  ];

  const categories = [
    'Sandwiches',
    'Burger',
    'Chicken Chup',
    'Drink',
    'Pizza',
    'Thi',
    'Non Veg',
    'Uncategorized',
  ];

  const productTags = [
    'Services',
    'Our Menu',
    'Pizza',
    'Cupcake',
    'Burger',
    'Cookies',
    'Our Shop',
    'Tandoori Chicken',
  ];

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(8000);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = latestProducts.filter(
    (product) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(product.category)) &&
      product.price <= priceRange
  );

  return (
    <aside className="w-1/4 p-4 border-r">
      {/* Search Field */}
      <div className="mb-6">
        <div className="relative flex items-center bg-[#fff4e6] rounded-md transition-transform duration-300 hover:scale-105">
          <input
            type="text"
            placeholder="Search Product"
            className="w-full h-12 pl-4 pr-14 text-sm text-gray-700 bg-transparent border-none focus:outline-none"
          />
          <div className="absolute right-0 w-12 h-12 bg-[#FFA500] flex justify-center items-center rounded-md">
            <img src="/Search.png" alt="Search Icon" className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Category Section */}
      <h3 className="font-semibold text-lg mb-4">Category</h3>
      <ul>
        {categories.map((category, index) => (
          <li
            key={index}
            className="mb-2 transition-all duration-300 hover:translate-x-2 hover:text-[#FFA500]"
          >
            <label>
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
              />{' '}
              {category}
            </label>
          </li>
        ))}
      </ul>

      {/* Tag Part: Display Selected Categories as Tags */}
      {selectedCategories.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Selected Categories:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <span
                key={category}
                className="bg-[#FFA500] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#cc8400]"
                onClick={() => toggleCategory(category)}
              >
                {category} &times;
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Banner Image */}
      <div className="my-6">
        <img
          src="/Banner.png"
          alt="Banner"
          className="w-full rounded shadow-md hover:shadow-2xl hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Filter By Price */}
      <h3 className="font-semibold text-lg mt-6 mb-4">Filter By Price</h3>
      <div className="space-y-2">
        <div className="relative flex items-center">
          <div className="w-4 h-4 bg-[#FFA500] rounded-full absolute -left-2 top-1/2 transform -translate-y-1/2 animate-pulse"></div>
          <input
            type="range"
            min="0"
            max="8000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 accent-[#FFA500] appearance-none"
            style={{
              background: `linear-gradient(to right, #FFA500 0%, #FFA500 ${
                (priceRange / 8000) * 100
              }%, #e5e5e5 ${(priceRange / 8000) * 100}%)`,
            }}
          />
          <div className="w-4 h-4 bg-[#FFA500] rounded-full absolute -right-2 top-1/2 transform -translate-y-1/2 animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>From $0 to ${priceRange}</span>
          <button
            className="text-sm hover:underline"
            onClick={() => setPriceRange(8000)}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Latest Products Section */}
      <h3 className="font-semibold text-lg mt-6 mb-4">Latest Products</h3>
      <div className="space-y-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center transition-transform duration-300 hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded mr-4 shadow-md"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <div className="text-yellow-500 text-sm">
                {'⭐'.repeat(product.stars)}
                {'☆'.repeat(5 - product.stars)}
              </div>
              <p className="text-gray-600 text-sm">${product.price}</p>
            </div>
          </div>
        ))}


      {/* Product Tags Section */}
      <h3 className="font-semibold text-lg mt-6 mb-4">Product Tags</h3>
      <div className="flex flex-wrap gap-2">
        {productTags.map((tag, index) => (
          <span
            key={index}
            className="border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-md transition-all duration-300 hover:bg-[#FFA500] hover:text-white cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>


      </div>
    </aside>
  );
}
