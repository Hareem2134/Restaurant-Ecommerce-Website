"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import ForAllHeroSections from "../../../components/ForAllHeroSections"; // Adjust path if needed
import { v4 as uuidv4 } from "uuid";
// Remove direct client import if not used elsewhere here, API routes handle Sanity client
// import { client } from "@/sanity/lib/client";
import ShippingRates from "../../../components/ShippingRates"; // Adjust path if needed
import { client } from "@/sanity/lib/client";

// Interface for items in the cart state (ensure 'id' is the Sanity _id)
interface CartItem {
  id: string; // This MUST be the Sanity document _id of the product/food
  name: string;
  price: number;
  quantity: number;
  image: string; // URL for the image
}

// Type for shipping options received from the API
type ShippingRateDetail = {
  id: string; // e.g., 'dhl_express', 'fedex_ground'
  provider: string; // e.g., 'DHL_EXPRESS', 'FEDEX_GROUND'
  service?: string; // e.g., 'Standard Ground'
  amount: number;
  duration?: string; // e.g., '3-7 Business Days'
  logo?: string; // e.g., '/logos/dhl_express.png'
};

// Define a type for the discount object fetched from Sanity
interface Discount {
    _id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const calculateSubtotal = (items: CartItem[]) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Fetch cart data from localStorage
  const fetchCartData = useCallback(() => {
    console.log("Fetching cart data...");
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsedItems = (JSON.parse(storedCart) as CartItem[]).map(item => {
             // --- CRITICAL VALIDATION ---
             if (!item || typeof item.id !== 'string' || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number' || item.quantity <= 0) {
                 console.warn("Invalid item structure found in localStorage cart, skipping:", item);
                 return null; // Mark invalid items
             }
             // --- Ensure ID is a string ---
             return {
                ...item,
                id: String(item.id)
             };
        }).filter((item): item is CartItem => item !== null); // Filter out invalid items

        if (parsedItems.length !== JSON.parse(storedCart).length) {
             console.warn("Some cart items from localStorage were invalid and skipped.");
             // Optionally update localStorage with the cleaned data
             // localStorage.setItem("cart", JSON.stringify(parsedItems));
        }

        console.log("Cart items loaded:", parsedItems);
        setCartItems(parsedItems);
        setSubtotal(calculateSubtotal(parsedItems));
      } catch (error) {
        console.error("Error parsing cart data from localStorage:", error);
        localStorage.removeItem("cart"); // Clear potentially corrupted data
        setCartItems([]);
        setSubtotal(0);
      }
    } else {
      console.log("No cart data found in localStorage.");
      setCartItems([]);
      setSubtotal(0);
    }
  }, []);

  // Effect to load cart on mount and listen for changes
  useEffect(() => {
    fetchCartData();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart") {
        console.log("Storage change detected for 'cart', refetching...");
        fetchCartData();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchCartData]);

  // --- Shipping Address State ---
  const [shippingAddress, setShippingAddress] = useState({
    street: "", city: "", state: "", zip: "", country: "", address2: "",
    billingSameAsShipping: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress((prev) => ({ ...prev, billingSameAsShipping: e.target.checked }));
  };

  // --- Cart Item Removal ---
  const removeItemFromCart = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSubtotal(calculateSubtotal(updatedCart));
    console.log(`Item ${id} removed from cart.`);
    // Trigger shipping refetch if needed (optional)
    // fetchShippingRates();
  };

  // --- Loading & Error States ---
  const [loading, setLoading] = useState(false); // For overall order processing
  const [loadingShipping, setLoadingShipping] = useState(false); // For shipping rates fetch
  const [shippingError, setShippingError] = useState<string | null>(null); // For shipping rates fetch error

  // --- Shipping Options State ---
  const [shippingOptions, setShippingOptions] = useState<ShippingRateDetail[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);

  const handleSelectShipping = useCallback((shippingId: string | null) => {
    console.log("CheckoutPage: handleSelectShipping called with:", shippingId);
    setSelectedShippingId(shippingId);
  }, []);

  // --- Fetch Shipping Rates Logic (Debounced) ---
  const fetchShippingRates = useCallback(async () => {
    if (!shippingAddress.zip || !shippingAddress.country) {
      // Don't log warning constantly, only if fetch is attempted without details
      // console.warn("Skipping shipping rate fetch: Missing address details.");
      setShippingOptions([]); setSelectedShippingId(null); setShippingError(null);
      return;
    }
     if (cartItems.length === 0) {
        console.warn("Skipping shipping rate fetch: Cart is empty.");
        setShippingOptions([]); setSelectedShippingId(null); setShippingError(null);
        return;
     }

    console.log("Fetching shipping rates for:", shippingAddress.zip, shippingAddress.country);
    setLoadingShipping(true); setShippingError(null); setShippingOptions([]); setSelectedShippingId(null);

    try {
      const response = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: shippingAddress.zip, country: shippingAddress.country }),
      });

      // Use the "read once" pattern here too for robustness
      if (!response.ok) {
        let errorMsg = `Failed to fetch shipping rates (Status: ${response.status})`;
        let responseBodyText = '';
        try {
            responseBodyText = await response.text(); // Read body once
            console.error("Shipping rates API error response:", responseBodyText);
            try { const errorData = JSON.parse(responseBodyText); errorMsg = errorData.error || errorMsg; }
            catch (_) { /* Ignore JSON parse error */ }
        } catch (readError) { errorMsg += ` and response body could not be read.` }
        throw new Error(errorMsg);
      }

      const data = await response.json(); // Parse JSON only if response.ok
      console.log("Shipping API Response:", data);

      if (typeof data !== 'object' || data === null || Object.keys(data).length === 0) {
         setShippingError("No shipping rates available for this address.");
         setShippingOptions([]); return;
      }

      // Map the received rates (adjust structure based on your actual API response)
      const formattedOptions: ShippingRateDetail[] = Object.entries(data).map(([key, value]) => ({
        id: key, // e.g., 'dhl_express'
        provider: key.toUpperCase().replace('_', ' '), // e.g., 'DHL EXPRESS'
        amount: Number(value),
        logo: `/logos/${key.toLowerCase()}.png`, // Assumes logo naming convention
        duration: "3-7 Business Days", // Placeholder
        service: "Standard Service" // Placeholder
      }));

      if (formattedOptions.length === 0) {
        setShippingError("No shipping rates formatted for this address.");
        setShippingOptions([]);
      } else {
        setShippingOptions(formattedOptions);
      }

    } catch (error) {
      console.error("Shipping fetch error:", error);
      setShippingError(error instanceof Error ? error.message : "An unknown error occurred while fetching shipping rates.");
      setShippingOptions([]);
    } finally {
      setLoadingShipping(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress.zip, shippingAddress.country, cartItems]); // Re-fetch if address or cart changes

  useEffect(() => {
    const timerId = setTimeout(() => { fetchShippingRates(); }, 1000); // Debounce
    return () => clearTimeout(timerId);
  }, [fetchShippingRates]);

  // --- Discount State & Logic ---
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // Percentage value
  const [discountDetails, setDiscountDetails] = useState<Discount | null>(null); // Store matched discount object
  const [discounts, setDiscounts] = useState<Discount[]>([]); // Use specific type

  useEffect(() => { // Fetch discounts on mount
    const fetchDiscounts = async () => {
      try {
        // Fetch only active discounts that haven't expired
        const discountData = await client.fetch<Discount[]>(
          `*[_type == "discount" && active == true && (!defined(expiry) || expiry > now())] {
            code, type, value, _id
          }`
        );
        setDiscounts(discountData || []);
        console.log("Fetched discounts:", discountData);
      } catch (error) {
        console.error("Error fetching discounts from Sanity:", error);
      }
    };
    fetchDiscounts();
  }, []);

  const applyDiscount = () => {
    const codeUpper = discountCode.trim().toUpperCase();
    const discount = discounts.find((d) => d.code === codeUpper);

    if (discount) {
      if (discount.type === "percentage") {
        setAppliedDiscount(discount.value);
      } else if (discount.type === "fixed" && subtotal > 0) {
        const percentage = Math.min(100, (discount.value / subtotal) * 100);
        setAppliedDiscount(percentage);
      } else {
        setAppliedDiscount(0);
      }
      setDiscountDetails(discount);
      alert(`Discount Applied: ${discount.code}`);
    } else {
      alert("Invalid or expired discount code.");
      setAppliedDiscount(0); setDiscountDetails(null); setDiscountCode("");
    }
  };

  // --- Calculated Totals ---
  const selectedShippingRate = shippingOptions.find(opt => opt.id === selectedShippingId);
  const selectedShippingCost = selectedShippingRate?.amount ?? 0;
  const discountRate = appliedDiscount / 100;
  const discountAmount = subtotal * discountRate; // Amount deducted
  const totalWithDiscount = Math.max(0, subtotal - discountAmount + selectedShippingCost);


  // --- Handle Order Submission ---
  const handlePlaceOrder = async () => {
    // 1. Frontend Validations
    if (cartItems.length === 0) { alert("Your cart is empty."); return; }
    const { street, city, state, zip, country } = shippingAddress;
    if (!street || !city || !state || !zip || !country) { alert("Please fill in all required shipping address fields."); return; }
    if (!selectedShippingId) { alert("Please select a shipping method."); return; }
    const selectedShippingOption = shippingOptions.find(s => s.id === selectedShippingId);
    if (!selectedShippingOption) { alert("Selected shipping method is invalid. Please re-select."); setSelectedShippingId(null); return; } // Should not happen ideally
    if (!selectedPaymentMethod) { alert("Please select a payment method."); return; }

    setLoading(true); // Start loading indicator
    console.log("--- Initiating Order Placement ---");
    console.log("Selected Shipping Option Details:", selectedShippingOption);

    // 2. Prepare Data Object for /api/order/create
    //    (Structure defined based on what the API route expects)
    console.log("🛒 Cart Items before mapping for API:", JSON.stringify(cartItems, null, 2));

    const orderDataForApi = {
      // Fields needed by /api/order/create to build the Sanity document
      items: cartItems.map((item) => {
          // Log each item being prepared
          console.log(`Preparing item for API: ID=${item.id}, Name=${item.name}, Qty=${item.quantity}, Price=${item.price}`);
          // *** CRITICAL: Ensure item.id is the Sanity _id ***
          if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
              console.error("❌ Invalid item structure being sent:", item);
          }
          return {
            id: item.id, // The Sanity _id of the product/food
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null
          };
      }),
      subtotal: subtotal,
      discountAmount: discountAmount,
      discountCode: discountDetails ? discountDetails.code : null,
      shippingCost: selectedShippingOption.amount, // Send calculated cost
      total: totalWithDiscount,
      shippingAddress: { // Send the address object
        street: shippingAddress.street,
        address2: shippingAddress.address2 || null,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
      },
      billingSameAsShipping: shippingAddress.billingSameAsShipping, // Send the flag
      // Conditionally send billing address if different (assuming structure is same as shipping)
      ...(shippingAddress.billingSameAsShipping === false && {
           billingAddress: { // API needs to handle creating this object
                street: shippingAddress.street, // Replace with actual billing fields if different
                address2: shippingAddress.address2 || null,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zip: shippingAddress.zip,
                country: shippingAddress.country,
           }
      }),
      paymentMethod: selectedPaymentMethod,
      shippingMethod: { // Send the selected shipping method details
        provider: selectedShippingOption.provider,
        service: selectedShippingOption.service || "Standard",
        cost: selectedShippingOption.amount,
        estimatedDelivery: selectedShippingOption.duration || "N/A",
        rateId: selectedShippingOption.id
      },
    };
    console.log("📦 Order Data Prepared for /api/order/create:", JSON.stringify(orderDataForApi, null, 2));


    // 3. Process Order (API Calls)
    let orderId = null; // To store the Sanity document ID
    try {
      // === Step 1: Create Order Document ===
      console.log("📞 Calling POST /api/order/create...");
      const orderResponse = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": 'application/json' },
        body: JSON.stringify(orderDataForApi), // Send the prepared data
      });

      // Handle potential errors from order creation API
      if (!orderResponse.ok) {
        let errorMsg = `Failed to create order (Status: ${orderResponse.status})`;
        let responseBodyText = '';
        try {
            responseBodyText = await orderResponse.text(); // Read body once
            console.error("Order creation API error response:", responseBodyText);
            try { const errorData = JSON.parse(responseBodyText); errorMsg = errorData.message || errorData.error || errorMsg; }
            catch (_) { console.warn("Could not parse order creation error response as JSON.") }
        } catch (readError) { errorMsg += ` and response body could not be read.` }
        throw new Error(errorMsg); // Throw to main catch block
      }

      // Extract the REAL Sanity document ID from the successful response
      const responseData = await orderResponse.json();
      orderId = responseData?.orderId; // Use optional chaining
      console.log("✅ Response data received from /api/order/create:", JSON.stringify(responseData, null, 2));

      if (!orderId) {
        console.error("❌ 'orderId' key was missing or falsy in the response from /api/order/create:", responseData);
        throw new Error("Order created, but API did not return a valid Sanity Order ID.");
      }
      console.log("✅ Order created successfully with Sanity ID:", orderId);


      // --- *** TEMPORARY TRANSACTION ID SIMULATION *** ---
      const fakeTransactionId = `txn_fake_${Date.now()}`;
      console.log("🧪 Simulating successful payment with Fake Transaction ID:", fakeTransactionId);
      // --- *** END SIMULATION *** ---


      // === Step 2: Create Shipping Label ===
      console.log(`📞 Calling POST /api/shipping/create-label for Order ID: ${orderId}, Rate ID: ${selectedShippingId}`);
      const labelResponse = await fetch('/api/shipping/create-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rateId: selectedShippingId, orderSanityId: orderId }),
      });

       // Handle potential errors from label creation API
      if (!labelResponse.ok) {
        let labelErrorMsg = `Shipping label creation failed (Status: ${labelResponse.status})`;
        let labelResponseBodyText = '';
        try {
            labelResponseBodyText = await labelResponse.text(); // Read body once
            console.error("Label creation API error response:", labelResponseBodyText);
            try { const errorData = JSON.parse(labelResponseBodyText); labelErrorMsg = errorData.message || errorData.error || labelErrorMsg; }
            catch (_) { console.warn("Could not parse label creation error response as JSON.") }
        } catch (readError) { labelErrorMsg += ` and response body could not be read.` }
        throw new Error(labelErrorMsg); // Throw to main catch block
      }

      // Extract label details from successful response
      const { trackingNumber, labelUrl } = await labelResponse.json();
      console.log("✅ Label created successfully:", { trackingNumber, labelUrl });


      // === Step 3: Update Order Document (Tracking, Status, TxnID) ===
      console.log(`📞 Calling PATCH /api/order/update for Order ID: ${orderId}`);
      const updateResponse = await fetch('/api/order/update', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              orderId: orderId, // The Sanity _id
              trackingNumber: trackingNumber,
              labelUrl: labelUrl,
              status: 'processing', // Update status
              transactionId: fakeTransactionId // Include fake (or real) ID
          })
      });

      // Handle potential errors from update API
      if (!updateResponse.ok) {
        let updateErrorMsg = `Failed to update order status (Status: ${updateResponse.status})`;
        let updateResponseBodyText = '';
        try {
            updateResponseBodyText = await updateResponse.text(); // Read body once
            console.error("Order update API error response:", updateResponseBodyText);
            try { const errorData = JSON.parse(updateResponseBodyText); updateErrorMsg = errorData.message || errorData.error || updateErrorMsg; }
            catch (_) { console.warn("Could not parse order update error response as JSON.") }
        } catch (readError) { updateErrorMsg += ` and response body could not be read.` }
        // Decide how critical this is. Maybe log error but don't throw? For now, throw.
        throw new Error(updateErrorMsg);
      }

      console.log("✅ Order update API call successful.");
      const updateData = await updateResponse.json(); // Optional: log update response data
      console.log("Order update response data:", updateData);


      // === Step 4: Success - Clear Cart & Redirect ===
      localStorage.removeItem("cart");
      setCartItems([]); // Clear local state
      setSubtotal(0);
      console.log("✅ Cart cleared, redirecting to confirmation page...");
      window.location.href = `/Order-Confirmation?orderId=${orderId}`; // Redirect

    } catch (error) { // Catch errors from any step above
      console.error('💥 Order processing failed:', error);
      // Show user-friendly error message
      alert(`Order processing failed: ${error instanceof Error ? error.message : 'An unknown error occurred.'}\nPlease check the console for details or contact support.`);
      // Keep loading state true until alert is dismissed? Maybe not. Let finally handle it.
    } finally {
      setLoading(false); // Stop loading indicator regardless of success or failure
      console.log("--- Order Placement Attempt Finished ---");
    }
  }; // End of handlePlaceOrder

  // --- Payment Methods ---
  const paymentMethods = [
    { id: "credit_card", name: "Credit Card (Placeholder)" },
    { id: "paypal", name: "PayPal (Placeholder)" },
  ];

  // --- JSX Rendering ---
  return (
    <>
      {/* Assume ForAllHeroSections is a valid component */}
      <ForAllHeroSections/>

      {/* Loading Overlay */}
      {loading && (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[999]">
           <div className="bg-white p-8 rounded-lg shadow-xl text-center">
             <div className="loader mb-4 mx-auto"></div>
             <p className="text-lg font-semibold text-gray-700">Processing your order...</p>
             <p className="text-sm text-gray-500">Please wait...</p>
           </div>
         </div>
      )}

      {/* Main Checkout Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row justify-between lg:gap-12">

          {/* Left Section: Shipping & Payment */}
          <div className="w-full lg:w-3/5 order-2 lg:order-1">
            {/* Shipping Address Form */}
             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" name="street" placeholder="Street Address *" className="border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-none" value={shippingAddress.street} onChange={handleInputChange} required />
                    <input type="text" name="address2" placeholder="Apt, Suite, etc. (Optional)" className="border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-none" value={shippingAddress.address2} onChange={handleInputChange} />
                    <input type="text" name="city" placeholder="City *" className="border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-none" value={shippingAddress.city} onChange={handleInputChange} required />
                    <input type="text" name="state" placeholder="State / Province *" className="border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-none" value={shippingAddress.state} onChange={handleInputChange} required />
                    <input type="text" name="zip" placeholder="ZIP / Postal Code *" className="border p-3 rounded w-full focus:ring-1 focus:ring-orange-400 outline-none" value={shippingAddress.zip} onChange={handleInputChange} required />
                    <select name="country" value={shippingAddress.country} onChange={handleInputChange} className="border p-3 rounded w-full text-gray-500 focus:ring-1 focus:ring-orange-400 outline-none bg-white" required>
                        <option value="">Select Country *</option>
                        <option value="PK">Pakistan</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        {/* Add other countries */}
                    </select>
                </div>
                {/* Billing Address Section */}
                 <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-medium mb-2 text-gray-700">Billing Address</h3>
                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-400" onChange={handleCheckboxChange} checked={shippingAddress.billingSameAsShipping} />
                        <span>Same as shipping address</span>
                    </label>
                    {!shippingAddress.billingSameAsShipping && (
                        <div className="mt-4 p-4 border rounded bg-gray-50">
                            <p className="text-sm text-gray-600 font-medium mb-2">Enter Billing Address:</p>
                            {/* Add actual billing address input fields here, similar to shipping */}
                            {/* Example: <input type="text" name="billingStreet" ... /> */}
                            <p className="text-xs text-red-500">(Billing address input fields need to be implemented)</p>
                        </div>
                    )}
                 </div>
            </div> {/* End Shipping Address Form */}

            {/* Shipping Method Section */}
            <div id="shipping-options-section" className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Shipping Method</h2>
                <ShippingRates
                    shippingAddress={shippingAddress}
                    cartItems={cartItems} // Pass cart if needed by API
                    onSelectShipping={handleSelectShipping}
                    selectedShippingId={selectedShippingId}
                    shippingOptionsFromParent={shippingOptions}
                    loading={loadingShipping}
                    error={shippingError}
                />
            </div> {/* End Shipping Method Section */}

            {/* Payment Method Section */}
             <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h2>
                <div className="space-y-3">
                    {paymentMethods.map((method) => (
                        <label key={method.id} className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-orange-400 transition-colors duration-200 has-[:checked]:bg-orange-50 has-[:checked]:border-orange-500">
                            <input type="radio" name="paymentMethod" value={method.id} checked={selectedPaymentMethod === method.id} onChange={(e) => setSelectedPaymentMethod(e.target.value)} className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"/>
                            <span className="text-gray-700 font-medium">{method.name}</span>
                        </label>
                    ))}
                </div>
                {/* Placeholder for actual payment form (e.g., Stripe Elements) */}
                {selectedPaymentMethod === 'credit_card' && ( <div className="mt-4 p-4 border rounded bg-gray-50 text-sm text-gray-600">Credit Card input form placeholder. Implement secure payment capture here.</div> )}
                {selectedPaymentMethod === 'paypal' && ( <div className="mt-4 p-4 border rounded bg-gray-50 text-sm text-gray-600">PayPal button integration placeholder.</div> )}
            </div> {/* End Payment Method Section */}

            {/* Action Buttons */}
             <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 transition duration-200 order-2 sm:order-1 w-full sm:w-auto" onClick={() => window.history.back()}> {/* Or link to cart */}
                    ← Back
                </button>
                <button className="px-8 py-3 bg-[#FF9F0D] text-white rounded-md shadow-md hover:bg-[#e58b0a] transition duration-200 flex items-center justify-center gap-2 order-1 sm:order-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed" onClick={handlePlaceOrder} disabled={loading || cartItems.length === 0 || !selectedShippingId || !selectedPaymentMethod}> {/* More robust disabled check */}
                    {loading ? 'Processing...' : 'Place Order'} →
                </button>
             </div> {/* End Action Buttons */}

          </div> {/* End Left Section */}


          {/* Right Section: Order Summary */}
           <div className="w-full lg:w-2/5 order-1 lg:order-2 mb-8 lg:mb-0">
                <div className="sticky top-24 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-5 text-gray-800 border-b pb-3">Order Summary</h2>
                    {/* Cart Items Display */}
                    <div className="max-h-60 overflow-y-auto space-y-4 mb-4 pr-2">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-2 last:border-b-0">
                                    <div className="relative flex-shrink-0">
                                        <Image src={item.image || "/placeholder-image.png"} alt={item.name} className="w-14 h-14 rounded object-cover border" width={56} height={56}/>
                                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">{item.quantity}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-sm font-medium text-gray-700 line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-gray-800 flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</div>
                                    <button title="Remove item" className="text-red-400 hover:text-red-600 text-lg ml-1 flex-shrink-0" onClick={() => removeItemFromCart(item.id)}> × </button>
                                </div>
                            ))
                        ) : ( <p className="text-gray-500 text-center py-4">Your cart is empty.</p> )}
                    </div>
                    {/* Discount Code Input */}
                    <div className="mt-4 border-t pt-4">
                        <label htmlFor="discountCode" className="block text-sm font-medium text-gray-600 mb-1">Apply Discount Code</label>
                        <div className="flex gap-2">
                            <input id="discountCode" type="text" className="border p-2 rounded w-full text-sm focus:ring-1 focus:ring-orange-400 outline-none" placeholder="Enter code" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} disabled={!!discountDetails}/>
                            <button onClick={applyDiscount} className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition duration-200 disabled:opacity-50" disabled={!discountCode || !!discountDetails || subtotal === 0}>Apply</button>
                        </div>
                        {discountDetails && (
                            <div className="mt-2 text-green-600 text-sm flex justify-between items-center">
                                <span>Code "{discountDetails.code}" applied!</span>
                                <button onClick={() => { setAppliedDiscount(0); setDiscountDetails(null); setDiscountCode(''); }} className="text-red-500 text-xs hover:underline">Remove</button>
                            </div>
                        )}
                    </div>
                    {/* Price Breakdown */}
                    <div className="mt-5 space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between text-gray-600"><span>Subtotal</span> <span>${subtotal.toFixed(2)}</span></div>
                        {discountAmount > 0 && (<div className="flex justify-between text-green-600"><span>Discount ({appliedDiscount.toFixed(0)}%)</span> <span>-${discountAmount.toFixed(2)}</span></div>)}
                        <div className="flex justify-between text-gray-600"><span>Shipping</span> <span>{selectedShippingId ? `$${selectedShippingCost.toFixed(2)}` : 'Select address'}</span></div>
                    </div>
                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold text-gray-800 mt-4 border-t pt-4">
                        <span>Total</span> <span>${totalWithDiscount.toFixed(2)}</span>
                    </div>
                </div>
           </div> {/* End Right Section */}

        </div>
      </div>

      {/* Loader styles */}
      <style jsx>{`
        .loader { width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #ff9f0d; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
} // End of CheckoutPage component