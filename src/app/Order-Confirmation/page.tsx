"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingCart, Download, Truck, CheckCircle, Info, ExternalLink, FileText } from "lucide-react"; // Added icons
import Link from "next/link";
import { client } from '@/sanity/lib/client'; // Adjust path if needed
import Image from "next/image";

//OrderDetails type is defined in @/types/orderTypes and includes all necessary fields
import { OrderDetails } from "@/types/orderTypes"; // Use your shared type

// Placeholder image if item image is missing
const PLACEHOLDER_IMAGE = "/placeholder-image.png";

// --- Helper Function for Tracking URLs ---
const getCarrierTrackingUrl = (provider?: string | null, trackingNumber?: string | null): string | null => {
    if (!provider || !trackingNumber) return null;
    const p = provider.toLowerCase().trim().replace(/ /g, ''); // Normalize: lowercase, no spaces

    const trackingUrls: Record<string, string> = {
        'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
        'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
        'fedex': `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
        'fedexground': `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`, // Handle variations
        'dhl': `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`,
        'dhlexpress': `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`,
        // Add other carriers you use
    };

    // Attempt direct lookup first
    if (trackingUrls[p]) {
        return trackingUrls[p];
    }
    // Fallback: check if the key *includes* a known carrier name
    if (p.includes('fedex')) return trackingUrls['fedex'];
    if (p.includes('ups')) return trackingUrls['ups'];
    if (p.includes('dhl')) return trackingUrls['dhl'];
    if (p.includes('usps')) return trackingUrls['usps'];

    console.warn(`Unknown carrier provider for tracking link: ${provider}`);
    return null; // Return null if carrier is not recognized
};
// --- End Helper Function ---


function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderIdFromUrl = searchParams?.get("orderId");

  useEffect(() => {
    if (!orderIdFromUrl) {
      if (searchParams !== null) { setError("Order ID missing from URL parameters."); }
      else { console.log("Order Confirmation: searchParams is null, waiting..."); }
      setLoading(false); return;
    }

    const fetchOrderFromSanity = async () => {
      setLoading(true); setError(null); setOrder(null); // Reset states
      try {
        // Fetch ALL fields needed for display and links
        const query = `*[_type == "order" && _id == $orderId][0] {
          _id, orderNumber, orderDate, status, subtotal, discountAmount, discountCode,
          shippingCost, total, paymentMethod, shippingLabelUrl, trackingNumber, email,
          shippingAddress,
          shippingMethod { provider }, // Fetch provider for tracking link
          items[]{
             _key, quantity, nameAtPurchase, priceAtPurchase, image
             // If image is reference: "image": image.asset->url
          }
        }`;
        const params = { orderId: orderIdFromUrl };
        const data = await client.fetch<OrderDetails>(query, params);
        if (data) { setOrder(data); }
        else { setError(`Order details could not be found (ID: ${orderIdFromUrl}).`); }
      } catch (err: any) { setError("Failed to load order details."); console.error("Error fetching order:", err); }
      finally { setLoading(false); }
    };
    fetchOrderFromSanity();
  }, [orderIdFromUrl, searchParams]);


  // --- Loading / Error / Not Found States ---
  if (loading) return <div className="text-center py-20 text-gray-600 dark:text-gray-400">Loading order details...</div>;
  if (error) return <div className="text-center py-20 px-6 text-red-600 dark:text-red-400 flex flex-col items-center gap-4"><Info size={48}/> <p>Error: {error}</p> <Link href="/shop" className="text-blue-600 dark:text-blue-400 hover:underline">Go Shopping</Link></div>;
  if (!order) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Order not found.</div>;


  // --- Prepare Derived Data ---
  const address = order.shippingAddress || {};
  const trackingUrl = getCarrierTrackingUrl(order.shippingMethod?.provider, order.trackingNumber);
  // --- End Derived Data ---


  // --- Render Order Details ---
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl mx-auto my-8 md:my-12 p-6 md:p-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl" // Wider, more padding, subtle shadow
    >
      {/* --- Header --- */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mb-4 mx-auto" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg mb-1">
          Thank you for your purchase! We're getting your order ready.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
            Order <span className="font-semibold text-orange-600 dark:text-orange-400">#{order.orderNumber}</span>
            <span className="mx-2">|</span>
            Placed on {new Date(order.orderDate).toLocaleDateString()}
            <span className="mx-2">|</span>
            Status: <span className="font-medium capitalize px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">{order.status}</span>
        </p>
      </div>

       {/* --- Items Summary --- */}
       <div className="mb-8">
         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Items Ordered</h2>
         {(order.items && order.items.length > 0) ? (
          <div className="space-y-4 border border-gray-200 dark:border-gray-700 rounded-md p-4 max-h-[400px] overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900/30">
            {order.items.map((item) => (
              <div key={item._key} className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                 <div className="relative flex-shrink-0 w-16 h-16 rounded overflow-hidden border dark:border-gray-600 bg-white dark:bg-gray-700">
                     <Image
                        src={item.image || PLACEHOLDER_IMAGE}
                        alt={item.nameAtPurchase || 'Product Image'}
                        fill className="object-contain p-1" // Contain + padding
                     />
                 </div>
                 <div className="flex-grow">
                   <p className="font-medium text-gray-800 dark:text-gray-100">{item.nameAtPurchase || 'N/A'}</p>
                   <p className="text-sm text-gray-500 dark:text-gray-400">
                     Qty: {item.quantity || 0} × ${(item.priceAtPurchase ?? 0).toFixed(2)}
                   </p>
                 </div>
                 <p className="font-semibold text-gray-700 dark:text-gray-200 text-right flex-shrink-0">
                   ${((item.quantity || 0) * (item.priceAtPurchase ?? 0)).toFixed(2)}
                 </p>
              </div>
            ))}
          </div>
         ) : ( <p className="text-gray-500 dark:text-gray-400 text-center py-4 italic border rounded-md dark:border-gray-700">No items listed for this order.</p> )}
       </div>

       {/* --- Financial & Shipping Grid --- */}
       <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 mb-8">
        </div>

           {/* Billing Summary (Takes 2 cols on desktop) */}
           <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-6">
               <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Billing Summary</h2>
               <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                   <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">${(order.subtotal ?? 0).toFixed(2)}</span></div>
                   {order.discountAmount > 0 && (
                       <div className="flex justify-between text-green-600 dark:text-green-400">
                           <span>Discount {order.discountCode ? `(${order.discountCode})` : ''}:</span>
                           <span className="font-medium">-${order.discountAmount.toFixed(2)}</span>
                       </div>
                   )}
                   <div className="flex justify-between"><span>Shipping:</span> <span className="font-medium">${(order.shippingCost ?? 0).toFixed(2)}</span></div>
                   <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white mt-3 border-t border-gray-300 dark:border-gray-500 pt-3">
                       <span>Total Paid:</span> <span>${(order.total ?? 0).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-xs pt-1 text-gray-500 dark:text-gray-400">
                       <span>Payment Method:</span>
                       <span className="capitalize">{order.paymentMethod?.replace('_', ' ') || 'N/A'}</span>
                   </div>
               </div>
           </div>

       {/* --- Financial & Shipping Grid --- */}
       {/* This div contains the two columns */}
       <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 mb-8">

           {/* Billing Summary (Column 1: Spans 2 cols on medium+) */}
           <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-6">
               <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Billing Summary</h2>
               <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2.5 bg-gray-50 dark:bg-gray-700/40 p-5 rounded-lg border dark:border-gray-600/50">
                   {/* ... Subtotal, Discount, Shipping, Total, Payment Method ... */}
                   <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">${(order.subtotal ?? 0).toFixed(2)}</span></div>
                   {order.discountAmount > 0 && ( <div className="flex justify-between text-green-600 dark:text-green-400"> ... </div> )}
                   <div className="flex justify-between"><span>Shipping:</span> <span className="font-medium">${(order.shippingCost ?? 0).toFixed(2)}</span></div>
                   <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white mt-3 border-t border-gray-300 dark:border-gray-500 pt-3"> ... </div>
                   <div className="flex justify-between text-xs pt-1 text-gray-500 dark:text-gray-400"> ... </div>
               </div>
           </div>

           {/* Shipping, Tracking & Downloads (Column 2: Spans 3 cols on medium+) */}
           <div className="md:col-span-3 border-t border-gray-200 dark:border-gray-700 pt-6">
               <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2"><Truck size={20}/> Shipping & Downloads</h2> {/* Combined Heading */}
               <div className="space-y-4"> {/* Container for boxes within this column */}

                   {/* Address Box */}
                   <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 p-4 rounded-md border dark:border-gray-600/50 space-y-1">
                        <p className="font-medium text-gray-800 dark:text-gray-100">Shipping Address:</p>
                        <p>{address.street || 'N/A'}</p>
                        {address.address2 && <p>{address.address2}</p>}
                        <p>{address.city || ''}, {address.state || ''} {address.zip || ''} [{address.country || ''}]</p>
                   </div>

                   {/* --- SINGLE Tracking & Downloads Box --- */}
                   <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/40 p-5 rounded-lg border dark:border-gray-600/50 space-y-3">
                        <p className="font-medium text-gray-800 dark:text-gray-100 mb-1">Tracking & Downloads:</p>

                        {/* Tracking Info */}
                        <div className="border-t dark:border-gray-600/50 pt-2">
                            {order.trackingNumber ? (
                                <>
                                    <p><strong>Number:</strong> <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-xs">{order.trackingNumber}</span></p>
                                    {order.shippingMethod?.provider && ( <p><strong>Carrier:</strong> {order.shippingMethod.provider}</p> )}
                                    {trackingUrl ? (
                                        <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium mt-1">
                                            Track Package <ExternalLink size={12} />
                                        </a>
                                    ) : ( <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">Official tracking link could not be generated.</p> )}
                                </>
                             ) : <p className="italic text-gray-500 dark:text-gray-400">Tracking information pending.</p>}
                        </div>

                        {/* Shipping Label Download */}
                        <div className="border-t dark:border-gray-600/50 pt-2">
                            {order.shippingLabelUrl ? (
                               <a href={order.shippingLabelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                                  <Download size={14} /> Shipping Label
                               </a>
                            ) : <p className="italic text-gray-500 dark:text-gray-400 text-xs">Shipping label not available.</p>}
                        </div>

                         {/* Invoice Download */}
                        <div className="border-t dark:border-gray-600/50 pt-2">
                            <a href={`/api/order/generate-pdf?orderId=${order._id}&download=true`} rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                                <FileText size={14} /> Invoice (PDF)
                            </a>
                        </div>
                   </div>{/* --- END SINGLE Tracking & Downloads Box --- */}
               </div>
           </div>{/* --- End Shipping, Tracking & Downloads Column --- */}
       </div> {/* --- End Financial & Shipping Grid --- */}

      {/* --- Action Buttons --- */}
      <motion.div className="flex flex-col sm:flex-row justify-center items-center mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 gap-4">
        <Link href="/Shop" className="flex items-center justify-center gap-2 px-6 py-2 text-white font-semibold bg-orange-500 hover:bg-orange-600 rounded-md shadow transition duration-300 ease-in-out w-full sm:w-auto">
          <ShoppingCart size={18} /> Continue Shopping
        </Link>
        <Link href="/" className="flex items-center justify-center gap-2 px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md shadow transition duration-300 ease-in-out w-full sm:w-auto">
            <Home size={18} /> Go to Homepage
         </Link>
      </motion.div>
    </motion.div>
  );
}

{/* Main Page Component */}
export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Suspense fallback={<div className="text-center py-40 text-gray-600 dark:text-gray-400">Loading Confirmation...</div>}>
            <OrderConfirmationContent />
        </Suspense>
    </div>
  );
}