import React from "react";
import Image from "next/image";
import ForAllHeroSections from "../../../components/ForAllHeroSections";

export default function CheckoutPage() {
  return (
    <><ForAllHeroSections />
    
    <div className="flex flex-col md:flex-row justify-between md:gap-8 p-14 bg-white">

      {/* Left Section: Shipping Address */}
      <div className="w-full md:w-2/3">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Fields */}
          <input type="text" placeholder="First name" className="border p-3 rounded" />
          <input type="text" placeholder="Last name" className="border p-3 rounded" />
          <input type="email" placeholder="Email address" className="border p-3 rounded" />
          <input type="text" placeholder="Phone number" className="border p-3 rounded" />
          <input type="text" placeholder="Company" className="border p-3 rounded" />
          <select className="border p-3 rounded text-gray-500">
            <option>Choose country</option>
            <option>United States</option>
          </select>
          <select className="border p-3 rounded text-gray-500">
            <option>Choose city</option>
            <option>New York</option>
          </select>
          <input type="text" placeholder="Zip code" className="border p-3 rounded" />
        </div>
        <input type="text" placeholder="Address 1" className="border p-3 rounded w-full mt-4" />
        <input type="text" placeholder="Address 2" className="border p-3 rounded w-full mt-2" />

        {/* Billing Address */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Billing Address</h2>
          <label className="flex items-center gap-2 mt-2">
            <input type="checkbox" className="w-5 h-5" />
            <span>Same as shipping address</span>
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded shadow hover:bg-gray-200">
            &larr; Back to cart
          </button>
          <button className="px-6 py-3 bg-[#FF9F0D] text-white rounded shadow hover:bg-[#e58b0a] flex items-center gap-2">
            Proceed to shipping &rarr;
          </button>
        </div>
      </div>

      {/* Right Section: Order Summary */}
      <div className="w-full md:w-1/3 mt-8 md:mt-0 border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex flex-col gap-4">
          {/* Products */}
          {[1, 2, 3].map((item) => (
            <div className="flex items-center gap-4" key={item}>
              <Image
                src="/ImageOnCheckoutPage.png"
                alt="Chicken Tikka Kabab"
                className="w-16 h-16 rounded"
                width={64} height={64} />
              <div>
                <h3 className="font-semibold">Chicken Tikka Kabab</h3>
                <p className="text-sm text-gray-500">150 gm net</p>
                <p className="text-sm text-gray-500">50$</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Sub-total</span>
            <span>130$</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Discount</span>
            <span>25%</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax</span>
            <span>54.76$</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-black">
            <span>Total</span>
            <span>432.65$</span>
          </div>
        </div>

        {/* Place Order Button */}
        <button className="mt-6 w-full px-6 py-3 bg-[#FF9F0D] text-white rounded shadow hover:bg-[#e58b0a] flex items-center justify-center">
          Place an order &rarr;
        </button>
      </div>
    </div></>
  );
}
