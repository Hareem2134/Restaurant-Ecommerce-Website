"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Download, Truck } from "lucide-react";
import Link from "next/link";
import { client } from '@/sanity/lib/client';
import Image from "next/image";

// Define the type accurately - ensure 'email' is included if needed by PDF/Email
interface OrderDetails {
  _id: string;
  orderNumber: string;
  orderDate: string;
  items?: { // Make optional in case fetch fails partially
    _key: string;
    product?: { _ref: string };
    nameAtPurchase: string;
    priceAtPurchase: number;
    quantity: number;
    image?: string;
  }[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string | null; // Allow null
  shippingCost: number;
  total: number;
  shippingAddress?: { // Make optional
    _type?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    address2?: string | null; // Allow null
  };
  paymentMethod?: string; // Make optional
  status: string;
  shippingLabelUrl?: string | null; // Allow null
  trackingNumber?: string | null; // Allow null
  email?: string | null; // Allow null if email might not be present
}


function OrderConfirmationContent() {
  const searchParams = useSearchParams(); // Can return null initially
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- FIX: Use optional chaining to safely get orderId ---
  const orderIdFromUrl = searchParams?.get("orderId");
  // --- END FIX ---

  useEffect(() => {
    // Now orderIdFromUrl can be string | null | undefined

    if (!orderIdFromUrl) {
      // Handle cases where searchParams was null OR 'orderId' was missing
      if (searchParams !== null) { // Only log/error if params existed but ID didn't
         console.warn("❌ No 'orderId' parameter found in URL!");
         setError("Order ID missing from URL parameters.");
      } else {
         // searchParams was null, likely still initializing, wait for re-render
         console.log("searchParams is null, waiting...");
         // Don't set error yet, effect will re-run when searchParams updates
         // setLoading(false); // Keep loading until params are available
         return;
      }
      setLoading(false);
      return;
    }

    // If we reach here, orderIdFromUrl is a string
    console.log("Fetching order details for Sanity ID:", orderIdFromUrl);

    const fetchOrderFromSanity = async () => {
      setLoading(true);
      setError(null);
      try {
        const query = `*[_type == "order" && _id == $orderId][0] {
          _id, orderNumber, orderDate, status, subtotal, discountAmount, discountCode,
          shippingCost, total, paymentMethod, shippingLabelUrl, trackingNumber, email,
          shippingAddress,
          items[]{ _key, quantity, nameAtPurchase, priceAtPurchase, image }
        }`;
        const params = { orderId: orderIdFromUrl }; // Use the non-null ID

        console.log("Executing Sanity query:", query, params);
        const data = await client.fetch<OrderDetails>(query, params);
        console.log("Sanity fetch result:", data);

        if (data) {
          setOrder(data);
        } else {
           console.error(`Order with Sanity ID ${orderIdFromUrl} not found.`);
           setError(`Order details could not be found.`);
        }
      } catch (err: any) {
        console.error("❌ Error fetching order from Sanity:", err);
        setError("Failed to load order details. Please try refreshing.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderFromSanity();

  // Add searchParams to dependency array if needed, though orderIdFromUrl covers it
  }, [orderIdFromUrl, searchParams]);

  // --- Loading/Error/Not Found states ---
  if (loading) {
    return <p className="text-center text-gray-600 text-lg mt-60 mb-60">Loading order details...</p>;
  }
  if (error) {
     return <p className="text-center text-red-500 text-lg mt-60 mb-60">Error: {error}</p>;
  }
  if (!order) {
     // This might briefly show if searchParams becomes non-null but fetch hasn't completed
     // Or if fetch genuinely fails to find the order
     return <p className="text-center text-red-500 text-lg mt-60 mb-60">Order not found.</p>;
  }

  // --- Render Order Details ---
  const address = order.shippingAddress || {}; // Safe access

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-3xl mx-auto mt-10 mb-32 p-6 md:p-8 bg-white rounded-lg border border-gray-300 shadow-lg"
    >
      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b border-gray-200">
        <motion.h2 /* ... */ className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
          🎉 Order Confirmed!
        </motion.h2>
        <motion.p /* ... */ className="text-gray-600 text-base md:text-lg">
          Thank you! Your Order Number is:{" "}
          <span className="font-semibold text-orange-600">{order.orderNumber}</span>
        </motion.p>
         <p className="text-sm text-gray-500 mt-1">
            Order Date: {new Date(order.orderDate).toLocaleString()} | Status: <span className="font-medium capitalize">{order.status}</span>
         </p>
      </div>

       {/* Items Summary */}
       <div className="mb-8">
         <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">📦 Order Summary</h3>
         {/* Add safety check for items array */}
         {(order.items && order.items.length > 0) ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {order.items.map((item) => (
              <div key={item._key} className="flex items-center gap-4 p-3 border rounded-md bg-gray-50">
                 {/* ... item image rendering ... */}
                 {item.image ? ( <Image src={item.image} /* ... */ alt={""} /* ... */ /> ) : ( <div className="w-16 h-16 rounded bg-gray-200 flex-shrink-0"></div> )}
                 <div className="flex-grow">
                   {/* Add safety checks for item properties */}
                   <p className="font-medium text-gray-800">{item.nameAtPurchase || 'N/A'}</p>
                   <p className="text-sm text-gray-500">
                     Qty: {item.quantity || 0} @ ${(item.priceAtPurchase ?? 0).toFixed(2)} each
                   </p>
                 </div>
                 <p className="font-semibold text-gray-700 text-right flex-shrink-0">
                   ${((item.quantity || 0) * (item.priceAtPurchase ?? 0)).toFixed(2)}
                 </p>
              </div>
            ))}
          </div>
         ) : ( <p className="text-gray-500 text-center py-4">No items found in this order.</p> )}
       </div>


      {/* Totals Section */}
      <div className="border-t border-gray-200 mt-6 pt-6 mb-8">
         <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">💰 Billing Summary</h3>
         <div className="max-w-sm mx-auto text-gray-700 text-base space-y-1">
             {/* Add safety checks with ?? 0 */}
             <div className="flex justify-between"><span>Subtotal:</span> <span>${(order.subtotal ?? 0).toFixed(2)}</span></div>
             {order.discountAmount > 0 && (
                <div className="flex justify-between"><span>Discount:</span> <span>-${order.discountAmount.toFixed(2)}</span></div>
             )}
             <div className="flex justify-between"><span>Shipping:</span> <span>${(order.shippingCost ?? 0).toFixed(2)}</span></div>
             <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 border-t pt-2">
                 <span>Total:</span> <span>${(order.total ?? 0).toFixed(2)}</span>
             </div>
         </div>
      </div>


      {/* Shipping & Tracking Section */}
      <div className="border-t border-gray-200 mt-6 pt-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">🚚 Shipping Details</h3>
        <div className="text-center text-gray-700 text-base md:text-lg mb-4 bg-blue-50 p-4 rounded-md border border-blue-200">
             <p className="font-medium mb-1">Shipping Address:</p>
             <p>{address.street || 'N/A'}</p>
             {/* Check for address2 explicitly */}
             {address.address2 && <p>{address.address2}</p>}
             <p>{address.city || ''}, {address.state || ''} {address.zip || ''}</p>
             <p>{address.country || ''}</p>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && ( /* Check if trackingNumber exists */
             <div className="text-center text-sm text-gray-600 mb-4">
                 <strong>Tracking:</strong> {order.trackingNumber}
             </div>
         )}

        {/* Shipping Label Download Link */}
        {order.shippingLabelUrl && ( /* Check if URL exists */
          <div className="mt-4 text-center">
            {/* Ensure you have the /api/download-label route or remove it */}
            <a
              // href={`/api/download-label?url=${encodeURIComponent(order.shippingLabelUrl)}`} // Using proxy route
              href={order.shippingLabelUrl} // Direct link (might open in browser)
              download // Suggest download
              target="_blank" // Open in new tab
              rel="noopener noreferrer"
              className="..." // Your styles
            >
              <Download size={18} />
              Download Shipping Label
            </a>
            {/* ... */}
          </div>
        )}
        {/* If no label URL */}
        {!order.shippingLabelUrl && (
             <div className="mt-4 text-center text-gray-500 bg-gray-100 p-3 rounded-md border">
                 Shipping label not available.
             </div>
         )}
      </div>

      {/* PDF Invoice Download Link */}
      <div className="mt-6 pt-4 border-t text-center">
          <h3 className="text-lg font-medium mb-2">Order Invoice</h3>
          {/* Use optional chaining for _id */}
          <a
              href={`/api/order/generate-pdf?orderId=${order?._id}&download=true`} // Link to Pages API route
              rel="noopener noreferrer"
              className="..." // Your styles
          >
              <Download size={18} />
              Download Invoice (PDF)
          </a>
      </div>

      {/* Action Buttons */}
      <motion.div className="flex flex-col sm:flex-row justify-center items-center mt-10 pt-6 border-t border-gray-200 gap-4">
        {/* ... Links ... */}
      </motion.div>
    </motion.div>
  );
}

// Keep the Suspense wrapper around the content component
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-600 text-lg mt-60 mb-60">Loading...</p>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}