import React from 'react';

export default function FiltersSidebarOnShop() {
  const latestProducts = [
    { id: 1, name: 'Pizza', price: '$35.00', stars: 2, image: '/latestproduct.png' },
    { id: 2, name: 'Cupcake', price: '$35.00', stars: 2, image: '/latestproduct.png' },
    { id: 3, name: 'Cookies', price: '$35.00', stars: 2, image: '/latestproduct.png' },
    { id: 4, name: 'Burger', price: '$35.00', stars: 2, image: '/latestproduct.png' },
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

  return (
    <aside className="w-1/4 p-4 border-r">
      {/* Search Field */}
      <div className="mb-6">
        <div className="relative flex items-center bg-[#fff4e6] rounded-md">
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
        {[
          'Sandwiches',
          'Burger',
          'Chicken Chup',
          'Drink',
          'Pizza',
          'Thi',
          'Non Veg',
          'Uncategorized',
        ].map((category, index) => (
          <li key={index} className="mb-2">
            <label>
              <input type="checkbox" className="mr-2" /> {category}
            </label>
          </li>
        ))}
      </ul>

      {/* Banner Image */}
      <div className="my-6">
        <img src="/Banner.png" alt="Banner" className="w-full rounded" />
      </div>

      {/* Filter By Price */}
      <h3 className="font-semibold text-lg mt-6 mb-4">Filter By Price</h3>
      <div className="space-y-2">
        {/* Slider */}
        <div className="relative flex items-center">
          {/* Left Dot */}
          <div className="w-4 h-4 bg-[#FFA500] rounded-full absolute -left-2 top-1/2 transform -translate-y-1/2"></div>

          {/* Slider Input */}
          <input
            type="range"
            min="0"
            max="8000"
            className="w-full h-2 accent-[#FFA500] appearance-none"
            style={{
              background: `linear-gradient(to right, #FFA500 0%, #FFA500 100%)`,
            }}
          />

          {/* Right Dot */}
          <div className="w-4 h-4 bg-[#FFA500] rounded-full absolute -right-2 top-1/2 transform -translate-y-1/2"></div>
        </div>

        {/* Price Range and Filter Button */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>From $0 to $8000</span>
          <button className="text-sm hover:underline">Filter</button>
        </div>
      </div>

      {/* Latest Products Section */}
      <h3 className="font-semibold text-lg mt-6 mb-4">Latest Products</h3>
      <div className="space-y-4">
        {latestProducts.map((product) => (
          <div key={product.id} className="flex items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div>
              <p className="font-medium">{product.name}</p>
              <div className="text-yellow-500 text-sm">
                {'⭐'.repeat(product.stars)}
                {'☆'.repeat(5 - product.stars)}
              </div>
              <p className="text-gray-600 text-sm">{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Tags Section */}
      <h3 className="font-semibold text-lg mt-6 mb-4">Product Tags</h3>
      <div className="flex flex-wrap gap-2">
        {productTags.map((tag, index) => (
          <span
            key={index}
            className="border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>
    </aside>
  );
}
