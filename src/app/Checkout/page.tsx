"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ForAllHeroSections from "../../../components/ForAllHeroSections";
import { v4 as uuidv4 } from "uuid"; // Import UUID library
import DiscountPromotion from "../../../components/DiscountPromotion";
import { client } from "@/sanity/lib/client";
  
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state for animation
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    address2: "",
    billingSameAsShipping: false,
  });

  const handleCheckboxChange = () => {
    setShippingAddress((prev) => ({
      ...prev,
      billingSameAsShipping: !prev.billingSameAsShipping,
    }));
  };

  const [selectedShippingCompany, setSelectedShippingCompany] = useState("dhl");
  
  const shippingCompanies = [
    { id: "dhl", name: "DHL", cost: 30 },
    { id: "fedex", name: "FedEx", cost: 25 },
    { id: "ups", name: "UPS", cost: 20 },
  ];
  const selectedShippingCost = shippingCompanies.find((s) => s.id === selectedShippingCompany)?.cost || 30;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Dynamic selection

  const paymentMethods = [
    { id: "credit_card", name: "Credit Card" },
    { id: "paypal", name: "PayPal" },
    { id: "stripe", name: "Stripe" },
  ];

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discountData = await client.fetch(
          `*[_type == "discount" && active == true && expiry > now()] {
            code, type, value
          }`
        );
        setDiscounts(discountData);
      } catch (error) {
        console.error("Error fetching discounts from Sanity:", error);
      }
    };

    fetchDiscounts();
  }, []);

  const applyDiscount = () => {
    const discount = discounts.find((d) => d.code === discountCode.toUpperCase());
    if (discount) {
      if (discount.type === "percentage") {
        setAppliedDiscount(discount.value);
      } else if (discount.type === "fixed") {
        setAppliedDiscount((discount.value / subtotal) * 100);
      }
    } else {
      alert("Invalid discount code");
      setAppliedDiscount(0);
    }
  };

  const discountRate = appliedDiscount / 100;
  const discountAmount = subtotal * discountRate;
  const totalWithDiscount = subtotal - discountAmount + selectedShippingCost;

  const calculateSubtotal = (items: CartItem[]) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  const fetchCartData = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedItems = JSON.parse(storedCart) as CartItem[];
      setCartItems(parsedItems);
      setSubtotal(calculateSubtotal(parsedItems));
    }
  };

  useEffect(() => {
    fetchCartData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart") {
        fetchCartData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const discount = subtotal * discountRate;
  const total = subtotal - discount + selectedShippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add some products.");
      return;
    }
  
    const { street, city, state, zip, country } = shippingAddress;
    if (!street || !city || !state || !zip || !country) {
      alert("Please fill in all shipping details.");
      return;
    }

    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setLoading(true);
  
    const orderData = {
      _type: "order",
      items: cartItems.map((item) => ({
        _key: uuidv4(),
        food: { _ref: item.id.toString(), _type: "reference" },
        quantity: item.quantity,
        priceAtPurchase: item.price,
      })),
      total: totalWithDiscount,
      subtotal,
      discount: discountAmount,
      shippingCost: selectedShippingCost,
      status: "pending",
      date: new Date().toISOString(),
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
      },
      paymentMethod: selectedPaymentMethod,
      transactionId: `TXN-${Date.now()}`,
    };
  
  
    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const { orderId } = await response.json();
        localStorage.removeItem("cart");
        window.location.href = `/Order-Confirmation?orderId=${orderId}`;
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order.");
    } finally {
      setLoading(false);
    }
  };
  
  const validateDiscount = async (code: string) => {
    try {
      const response = await fetch(`/api/discounts?code=${code}`);
      if (!response.ok) {
        throw new Error("Discount not found");
      }
  
      const discounts = await response.json();
      const discount = discounts.find((d: any) => d.code === code && d.active);
  
      if (!discount) {
        throw new Error("Invalid or inactive discount");
      }
  
      return discount;
    } catch (error) {
      console.error("Error validating discount:", error);
      return null;
    }
  };

  const removeItemFromCart = (id: number) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSubtotal(calculateSubtotal(updatedCart));
  };

  return (
    <>
      <ForAllHeroSections />

      {/* Popper effect animation */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-md">
          <div className="bg-white p-8 rounded shadow-lg animate-popper">
            <p className="text-lg font-semibold">Processing your order...</p>
            <div className="mt-4 flex justify-center">
              <div className="loader"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between md:gap-8 px-40 py-12 bg-white">

        {/* Left Section: Shipping Address */}
        <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-lg shadow-gray-400">
        <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        name="street"
        placeholder="Street Address"
        className="border p-3 rounded w-full"
        value={shippingAddress.street}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        className="border p-3 rounded w-full"
        value={shippingAddress.city}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="state"
        placeholder="State"
        className="border p-3 rounded w-full"
        value={shippingAddress.state}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="zip"
        placeholder="ZIP Code"
        className="border p-3 rounded w-full"
        value={shippingAddress.zip}
        onChange={handleInputChange}
      />
      <select
        className="border p-3 rounded w-full text-gray-500"
        name="country"
        value={shippingAddress.country}
        onChange={handleInputChange}
      >
        <option value="">Select Country</option>
        <option value="United States">United States</option>
        <option value="Canada">Canada</option>
        <option value="United Kingdom">United Kingdom</option>
      </select>
    </div>

    <input
    type="text"
    name="address2"
    placeholder="Apartment, suite, etc. (optional)"
    className="border p-3 rounded w-full mt-4"
    value={shippingAddress.address2}
    onChange={handleInputChange}
    />
    <div className="mt-6">
      <h2 className="text-lg font-semibold">Billing Address</h2>
      <label className="flex items-center gap-2 mt-2">
        <input type="checkbox" className="w-5 h-5" onChange={handleCheckboxChange} checked={shippingAddress.billingSameAsShipping} />
        <span>Same as shipping address</span>
      </label>
      
    </div>
    <div className="flex justify-between items-center mt-6">
      <button
        className="px-6 py-3 bg-gray-100 text-gray-700 rounded shadow hover:bg-gray-200"
        onClick={() => (window.location.href = "/cart")}
      >
        &larr; Back to Cart
      </button>
      <button
        className="px-6 py-3 bg-[#FF9F0D] text-white rounded shadow hover:bg-[#e58b0a] flex items-center gap-2"
        onClick={handlePlaceOrder}
      >
        Place Order &rarr;
      </button>
    </div>
  </div>


        {/* Right Section: Order Summary */}
        <div className="w-full md:w-1/3 mt-8 md:mt-0 border p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex flex-col gap-4">
            {cartItems.map((item, index) => (
              <div key={item.id ?? `checkout-item-${index}`} className="flex items-center gap-4">
                <Image
                  src={item.image || "/ImageOnCheckoutPage.png"}
                  alt={item.name}
                  className="w-16 h-16 rounded"
                  width={64}
                  height={64}
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItemFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Sub-total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>${selectedShippingCost.toFixed(2)}</span>
            </div>
          </div>

          {/* Applying Discount */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Apply Discount Code</h2>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                className="border p-3 rounded w-full"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button
                onClick={applyDiscount}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
            {appliedDiscount > 0 && (
              <p className="text-green-500 mt-2">Discount Applied: {appliedDiscount}%</p>
            )}
          </div>

          <div className="flex justify-between text-lg font-bold text-black mt-2">
            <span>Total</span>
            <span>${totalWithDiscount.toFixed(2)}</span>
          </div>

          {/* Shipping Selection */}
          <div className="my-6">
            <h2 className="text-lg font-semibold mb-4">Select Shipping Company</h2>
            <select
              className="border p-3 rounded text-gray-500 w-full"
              value={selectedShippingCompany}
              onChange={(e) => setSelectedShippingCompany(e.target.value)}
            >
              {shippingCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} - ${company.cost}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Selection */}
          <div className="my-6">
            <label className="block text-lg font-semibold mb-2">Select Payment Method</label>
            <select
              className="border p-3 rounded text-gray-500 w-full"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            >
              <option value="">Choose payment method</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loader styles */}
      <style jsx>{`
        .loader {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #ff9f0d;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes popper {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-popper {
          animation: popper 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
}