"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Download, Truck } from "lucide-react"; // Added icons
import Link from "next/link";
import { client } from '@/sanity/lib/client'; // Adjust import path if needed
import Image from "next/image"; // Use Next Image for optimization

// Updated Interface to match Sanity schema and include new fields
interface OrderDetails {
  _id: string; // Sanity document ID
  orderNumber: string; // Your custom ORD-... ID
  orderDate: string; // Changed from 'date'
  items: {
    _key: string;
    product?: { _ref: string }; // Reference to product
    nameAtPurchase: string;
    priceAtPurchase: number;
    quantity: number;
    image?: string; // Optional image URL stored directly
    // Or fetch product details based on reference
    // productDetails?: { name: string; image: { asset: { url: string } } }
  }[];
  subtotal: number;
  discountAmount: number; // Renamed from discount for clarity
  shippingCost: number;
  total: number;
  shippingAddress: {
    _type?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  paymentMethod: string;
  status: string; // Added status
  shippingLabelUrl?: string; // Added for download link
  trackingNumber?: string; // Added for tracking info
}


function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderIdFromUrl = searchParams.get("orderId"); // This should be the Sanity _id

  useEffect(() => {
    if (!orderIdFromUrl) {
      console.warn("❌ No Sanity orderId found in URL!");
      setError("Order ID missing from URL.");
      setLoading(false);
      return;
    }

    console.log("Fetching order details for Sanity ID:", orderIdFromUrl);

    const fetchOrderFromSanity = async () => {
      setLoading(true);
      setError(null);
      try {
        // GROQ Query to fetch order by _id and required fields
        const query = `*[_type == "order" && _id == $orderId][0] {
          _id,
          orderNumber,
          orderDate,
          subtotal,
          discountAmount, // Use the correct field name from your schema
          discountCode,      // Fetch discount code
          shippingCost,
          total,
          shippingAddress,
          paymentMethod,
          status,
          shippingLabelUrl,
          trackingNumber,
          items[]{ // Fetch items array
            _key,
            quantity,
            nameAtPurchase,
            priceAtPurchase,
            image, // Fetch image URL if stored directly on item
            // Optionally fetch linked product details:
            // product->{ name, "imageUrl": image.asset->url }
          }
        }`;
        const params = { orderId: orderIdFromUrl };

        console.log("Executing Sanity query:", query, params);
        const data = await client.fetch<OrderDetails>(query, params);
        console.log("Sanity fetch result:", data);


        if (data) {
          // Ensure field names match (e.g., discountAmount vs discount)
          setOrder(data);
        } else {
           console.error(`Order with Sanity ID ${orderIdFromUrl} not found in Sanity.`);
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
  }, [orderIdFromUrl]); // Re-run effect if orderId changes

  if (loading) {
    return <p className="text-center text-gray-600 text-lg mt-60 mb-60">Loading order details...</p>;
  }

  if (error) {
     return <p className="text-center text-red-500 text-lg mt-60 mb-60">Error: {error}</p>;
  }

  if (!order) {
    return <p className="text-center text-red-500 text-lg mt-60 mb-60">Order not found.</p>;
  }

  // Safely access nested properties
  const address = order.shippingAddress || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-3xl mx-auto mt-10 mb-32 p-6 md:p-8 bg-white rounded-lg border border-gray-300 shadow-lg"
    >
      {/* Header */}
      <div className="text-center mb-8 pb-4 border-b border-gray-200">
        <motion.h2
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-bold text-green-600 mb-2" // Changed color
        >
          🎉 Order Confirmed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-600 text-base md:text-lg"
        >
          Thank you! Your Order Number is:{" "}
          <span className="font-semibold text-orange-600">{order.orderNumber}</span> {/* Display custom Order Number */}
        </motion.p>
         <p className="text-sm text-gray-500 mt-1">
            Order Date: {new Date(order.orderDate).toLocaleString()} | Status: <span className="font-medium capitalize">{order.status}</span>
         </p>
      </div>

       {/* Items Summary */}
       <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">📦 Order Summary</h3>
        {order.items && order.items.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {order.items.map((item) => (
              <div
                key={item._key} // Use Sanity _key
                className="flex items-center gap-4 p-3 border rounded-md bg-gray-50"
              >
                 {item.image && ( // Conditionally render image
                    <Image
                    src={item.image}
                    alt={item.nameAtPurchase}
                    width={64} // Specify width
                    height={64} // Specify height
                    className="w-16 h-16 rounded object-cover border border-gray-200 flex-shrink-0"
                    />
                 )}
                 {!item.image && <div className="w-16 h-16 rounded bg-gray-200 flex-shrink-0"></div>} {/* Placeholder */}

                <div className="flex-grow">
                  <p className="font-medium text-gray-800">{item.nameAtPurchase}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} @ ${item.priceAtPurchase.toFixed(2)} each
                  </p>
                </div>
                <p className="font-semibold text-gray-700 text-right flex-shrink-0">
                  ${(item.quantity * item.priceAtPurchase).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No items found in this order.</p>
        )}
      </div>


      {/* Totals Section */}
      <div className="border-t border-gray-200 mt-6 pt-6 mb-8">
         <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">💰 Billing Summary</h3>
         <div className="max-w-sm mx-auto text-gray-700 text-base space-y-1">
            <div className="flex justify-between"><span>Subtotal:</span> <span>${order.subtotal.toFixed(2)}</span></div>
            {/* Use discountAmount field */}
            <div className="flex justify-between"><span>Discount:</span> <span>-${order.discountAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span> <span>${order.shippingCost.toFixed(2)}</span></div>
            <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 border-t pt-2">
                <span>Total:</span> <span>${order.total.toFixed(2)}</span>
            </div>
        </div>
      </div>


      {/* Shipping & Tracking Section */}
      <div className="border-t border-gray-200 mt-6 pt-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">🚚 Shipping Details</h3>
        <div className="text-center text-gray-700 text-base md:text-lg mb-4 bg-blue-50 p-4 rounded-md border border-blue-200">
             <p className="font-medium mb-1">Shipping Address:</p>
             <p>{address.street || 'N/A'}</p>
             <p>{address.city || ''}, {address.state || ''} {address.zip || ''}</p>
             <p>{address.country || ''}</p>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
             <div className="text-center text-sm text-gray-600 mb-4">
                 <strong>Tracking:</strong> {order.trackingNumber}
                 {/* Add carrier-specific link if possible */}
             </div>
         )}


        {/* --- Shipping Label Download --- */}
        {order.shippingLabelUrl ? (
          <div className="mt-4 text-center">
            <a
              href={`/api/download-label?url=${encodeURIComponent(order.shippingLabelUrl)}`}
              download // Attempt to trigger download
              target="_blank" // Open in new tab is usually best for PDFs
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-md transition duration-200 shadow hover:shadow-md"
            >
              <Download size={18} />
              Download Shipping Label
            </a>
            <p className="text-xs text-gray-500 mt-1">Click link to view or download your label (PDF).</p>
          </div>
        ) : (
          <div className="mt-4 text-center text-gray-500 bg-gray-100 p-3 rounded-md border">
            Shipping label is being processed or is not available for this order.
          </div>
        )}
        {/* --- End Shipping Label Download --- */}
      </div>

      {/* PDF Invoice Download */}
      <div className="mt-6 pt-4 border-t text-center">
          <h3 className="text-lg font-medium mb-2">Order Invoice</h3>
          <a
              // Link to the new API route, passing the orderId and download=true
              href={`/api/order/generate-pdf?orderId=${order?._id}&download=true`}
              // No need for target="_blank" if download is forced by API headers
              // No need for download attribute if API forces it
              rel="noopener noreferrer" // Still good practice
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-md transition duration-200 shadow hover:shadow-md"
          >
              <Download size={18} />
              Download Invoice (PDF)
          </a>
      </div>

      {/* Action Buttons */}
      <motion.div className="flex flex-col sm:flex-row justify-center items-center mt-10 pt-6 border-t border-gray-200 gap-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-2 text-white font-semibold bg-gray-700 hover:bg-gray-800 rounded-md shadow transition duration-300 ease-in-out w-full sm:w-auto"
        >
          <Home size={20} /> Back to Home
        </Link>
        <Link
          href="/Shop" // Link to your Shop page
          className="flex items-center justify-center gap-2 px-6 py-2 text-white font-semibold bg-orange-500 hover:bg-orange-600 rounded-md shadow transition duration-300 ease-in-out w-full sm:w-auto"
        >
          <ShoppingCart size={20} /> Continue Shopping
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Keep the Suspense wrapper
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-600 text-lg mt-60 mb-60">Loading...</p>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}