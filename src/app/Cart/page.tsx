'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = () => {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
      setCartItems(storedCart);
    };
    fetchCart();
  }, []); // Run once on mount

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleRemoveItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  const handleApplyCoupon = () => {
    if (couponCode === 'DISCOUNT10') {
      setDiscount(0.1); // 10% discount
    } else {
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    router.push('/Checkout');
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCharges = 30.0;
  const totalAmount = cartSubtotal - cartSubtotal * discount + shippingCharges;

  return (
    <div className="min-h-screen bg-white px-8 py-12">
      <div className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg">
            Your cart is empty.{' '}
            <a href="/Shop" className="text-orange-500">
              Continue Shopping
            </a>
          </p>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Quantity</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.id ?? `cart-item-${index}`} className="border-b">
                    <td className="p-4 flex items-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="p-4">${item.price.toFixed(2)}</td>
                    <td className="p-4">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value) || 0)
                        }
                        className="w-16 border rounded px-2 py-1 text-center"
                        min="0"
                      />
                    </td>
                    <td className="p-4">${(item.price * item.quantity).toFixed(2)}</td>
                    <td
                      className="p-4 text-red-500 cursor-pointer"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      &times;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-6">
              <div className="w-full lg:w-1/3">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="flex justify-between mb-4">
                    <span>Cart Subtotal</span>
                    <span>${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>Discount</span>
                    <span>${(cartSubtotal * discount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span>Shipping Charges</span>
                    <span>${shippingCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="block text-center bg-orange-500 text-white mt-6 py-3 rounded font-semibold hover:bg-orange-600 w-full"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
