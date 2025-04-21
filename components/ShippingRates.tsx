"use client";
import React from "react";
import Image from "next/image";

// Define the shape of a shipping option expected by this component
type ShippingRateDetail = {
  id: string;
  provider: string;
  service?: string;
  amount: number;
  duration?: string;
  logo?: string;
};

// Define the props the component expects
interface ShippingRatesProps {
  shippingAddress: { zip?: string; country?: string }; // Only need relevant parts
  cartItems: any[]; // Pass if needed for rate calculation trigger (used in parent's useEffect)
  onSelectShipping: (id: string | null) => void; // Callback function
  selectedShippingId: string | null; // Controlled state from parent
  shippingOptionsFromParent: ShippingRateDetail[]; // Rates fetched by parent
  loading: boolean; // Loading state from parent
  error: string | null; // Error state from parent
}

export default function ShippingRates({
  onSelectShipping,
  selectedShippingId,
  shippingOptionsFromParent,
  loading,
  error,
}: ShippingRatesProps) {

  // No local state needed for selection - controlled by parent

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.target.value;
    console.log("ShippingRates: Radio changed, calling onSelectShipping with:", selectedId);
    onSelectShipping(selectedId); // Call the callback passed from parent
  };

  return (
    <div className="my-2"> {/* Reduced margin slightly */}
      {/* Loading State */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-100 py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
          <span>Loading shipping options...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
         <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
           <p><strong>Error:</strong> {error}</p>
         </div>
      )}

      {/* Options Display State */}
      {!loading && !error && shippingOptionsFromParent.length === 0 && (
        <p className="text-gray-100 py-4 text-sm">
          Please enter your ZIP/Postal code and Country above to see shipping options.
        </p>
      )}

      {!loading && !error && shippingOptionsFromParent.length > 0 && (
        <div className="space-y-3">
          {shippingOptionsFromParent.map((option) => (
            <label
              key={option.id}
              className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedShippingId === option.id
                  ? 'border-orange-500 ring-1 ring-orange-500' // Enhanced selected style
                  : 'border-gray-200 hover:border-gray-400' // Hover effect for non-selected
              }`}
            >
              {/* Radio Input */}
              <input
                type="radio"
                name="shippingOption" // Consistent name attribute
                value={option.id}
                checked={selectedShippingId === option.id} // Controlled by parent's state
                onChange={handleSelectionChange} // Trigger parent's update function
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
              />

              {/* Logo (Optional) */}
              {option.logo && (
                <Image
                  src={option.logo}
                  alt={`${option.provider} logo`}
                  width={60} // Adjust size as needed
                  height={25} // Adjust size as needed
                  className="object-contain flex-shrink-0" // Prevent distortion/shrinking
                />
              )}

              {/* Details */}
              <div className="flex-1">
                <p className="font-medium text-gray-100">{option.provider}</p>
                <p className="text-sm text-gray-100">
                  {option.service || 'Standard'} {/* Default service name */}
                  {option.duration && ` (${option.duration})`} {/* Show duration if available */}
                </p>
              </div>

              {/* Price */}
              <p className="font-semibold text-gray-100">
                ${option.amount.toFixed(2)}
              </p>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}