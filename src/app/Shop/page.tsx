import React from 'react';
import ForAllHeroSections from '../../../components/ForAllHeroSections';
import ProductCardOnShop from '../../../components/ProductCardOnShop';
import FiltersSidebarOnShop from '../../../components/FiltersSidebarOnShop';
import PaginationOnShop from '../../../components/PaginationOnShop';

export default function ShopPage() {
  const products = [
    { id: 1, name: 'Fresh Lime', price: 38, oldPrice: 45, image: 'FreshLime.png', isOnSale: false },
    { id: 2, name: 'Chocolate Muffin', price: 28, oldPrice: null, image: 'ChocolateMuffin.png', isOnSale: true },
    { id: 3, name: 'Burger', price: 21, oldPrice: 45, image: 'BurgerProduct.png', isOnSale: false },
    { id: 4, name: 'Country Burger', price: 45, oldPrice: null, image: 'CountryBurger.png', isOnSale: false },
    { id: 5, name: 'Drink', price: 23, oldPrice: 45, image: 'Drink.png', isOnSale: false },
    { id: 6, name: 'Pizza', price: 43, oldPrice: null, image: 'PizzaProduct.png', isOnSale: false },
    { id: 7, name: 'Cheese Butter', price: 10, oldPrice: null, image: 'CheeseButter.png', isOnSale: false },
    { id: 8, name: 'Sandwiches', price: 25, oldPrice: null, image: 'Sandwiches.png', isOnSale: false },
    { id: 9, name: 'Chicken Chup', price: 12, oldPrice: null, image: 'ChickenChup.png', isOnSale: true },
    { id: 10, name: 'Country Burger', price: 45, oldPrice: null, image: 'CountryBurger.png', isOnSale: false },
    { id: 11, name: 'Drink', price: 23, oldPrice: 45, image: 'Drink.png', isOnSale: false },
    { id: 12, name: 'Pizza', price: 43, oldPrice: null, image: 'PizzaProduct.png', isOnSale: false },
    { id: 13, name: 'Cheese Butter', price: 10, oldPrice: null, image: 'CheeseButter.png', isOnSale: false },
    { id: 14, name: 'Sandwiches', price: 25, oldPrice: null, image: 'Sandwiches.png', isOnSale: false },
    { id: 15, name: 'Chicken Chup', price: 12, oldPrice: null, image: 'ChickenChup.png', isOnSale: false },
  ];

  return (
    <>
      {/* Hero Section */}
      <div>
        <ForAllHeroSections />
      </div>

      {/* Main Shop Layout */}
      <div className="max-w-[1320px] mx-auto flex flex-col lg:flex-row space-y-12 lg:space-y-0 lg:space-x-12 mt-12 mb-12 px-4 sm:px-8 lg:px-36">
        {/* Main Content */}
        <div className="flex-1">
          {/* Sorting and Show Controls */}
          <div className="flex flex-wrap items-center mb-6 gap-4">
            <div>
              <label className="mr-2">Sort By:</label>
              <select className="border rounded p-2 pr-4">
                <option className='text-gray-400'>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
            <div>
              <label className="mr-2">Show:</label>
              <select className="border rounded p-2 pr-20">
                <option className='text-gray-400'>Default</option>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCardOnShop key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <PaginationOnShop />
        </div>

        {/* Sidebar */}
        <FiltersSidebarOnShop />
      </div>
    </>
  );
}
