"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { client } from '@/sanity/lib/client'; // Adjust path if needed
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Interface matching order structure (adjust as needed)
interface TrackedOrder {
    _id: string;
    orderNumber: string;
    status: string;
    trackingNumber?: string | null; // Allow null
    shippingMethod?: {
        provider?: string | null; // Allow null
    } | null; // Allow shippingMethod object itself to be null
    // Add other fields if needed
}

function TrackingContent() {
    const searchParams = useSearchParams(); // Can return null initially
    const [order, setOrder] = useState<TrackedOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- FIX: Use optional chaining to safely get trackingNumber ---
    const trackingNumberParam = searchParams?.get('number');
    // --- END FIX ---

    useEffect(() => {
        // trackingNumberParam can be string | null | undefined here

        if (!trackingNumberParam) {
            // Handle cases where searchParams was null OR 'number' was missing
             if (searchParams !== null) { // Only error if params existed but 'number' didn't
                console.warn("Tracking page: No 'number' parameter found in URL!");
                setError("No tracking number provided in URL.");
                setLoading(false);
             } else {
                 // searchParams was null, likely still initializing, wait for re-render
                 console.log("Tracking page: searchParams is null, waiting...");
                 // Keep loading until params are available
             }
            return; // Exit effect if no tracking number
        }

        // If we reach here, trackingNumberParam is a non-empty string
        console.log("Tracking page: Fetching order for tracking number:", trackingNumberParam);

        const fetchOrderByTracking = async () => {
            // Reset states for new fetch
            setLoading(true);
            setError(null);
            setOrder(null); // Clear previous order data

            try {
                 // Query Sanity by trackingNumber. Ensure index exists in Sanity schema!
                 const query = `*[_type == "order" && trackingNumber == $trackingNumber][0] {
                    _id,
                    orderNumber,
                    status,
                    trackingNumber,
                    shippingMethod { provider } // Get the carrier/provider
                }`;
                const params = { trackingNumber: trackingNumberParam }; // Use the validated param
                console.log("Executing Sanity tracking query:", query, params);
                const data = await client.fetch<TrackedOrder>(query, params);
                console.log("Sanity tracking fetch result:", data);


                if (data) {
                    setOrder(data);
                } else {
                    console.error(`No order found with tracking number: ${trackingNumberParam}`);
                    setError(`No order found with tracking number: ${trackingNumberParam}`);
                }
            } catch (err) {
                console.error("Failed to fetch order by tracking:", err);
                setError("Failed to load tracking details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderByTracking();

    // Add searchParams to dependency array to re-run when it becomes available
    }, [trackingNumberParam, searchParams]);

     // Function to generate carrier tracking URL
     const getCarrierTrackingUrl = (provider?: string | null, trackingNumber?: string | null): string | null => {
        // Check for null or empty strings
        if (!provider || !trackingNumber) return null;
        const p = provider.toLowerCase().trim(); // Normalize provider name

        // Add more specific checks if needed (e.g., based on tracking number format)
        if (p.includes('fedex')) {
            return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
        } else if (p.includes('ups')) {
            return `https://www.ups.com/track?loc=en_US&tracknum=${trackingNumber}`;
        } else if (p.includes('dhl')) {
            return `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`; // Updated DHL link example
        } else if (p.includes('usps')) {
             return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
        }
        // Add other carriers as needed
        console.warn(`Unknown carrier provider for tracking link: ${provider}`);
        return null; // Return null if carrier is not recognized
    };

    // Safely access potentially null properties using optional chaining
    const trackingUrl = getCarrierTrackingUrl(order?.shippingMethod?.provider, order?.trackingNumber);


    // --- Render Logic ---
    if (loading) return <p className="text-center p-10 text-gray-600">Loading tracking information...</p>;
    if (error) return <p className="text-center p-10 text-red-600">Error: {error}</p>;
    // Handle case where loading is false but order is still null (e.g., fetch failed silently - though unlikely with current logic)
    if (!order) return <p className="text-center p-10 text-gray-500">Tracking information not available.</p>;


    // If order is found, render details
    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block text-sm">
                <ArrowLeft size={16} className="inline mr-1 relative -top-px" /> Back to Home
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Track Your Order</h1>
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 space-y-3">
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Tracking Number:</strong> {order.trackingNumber || 'N/A'}</p>
                <p><strong>Status:</strong> <span className="font-semibold capitalize">{order.status}</span></p>

                {/* Display carrier if available */}
                {order.shippingMethod?.provider && (
                    <p><strong>Carrier:</strong> {order.shippingMethod.provider}</p>
                )}

                {/* Display tracking link */}
                {trackingUrl ? (
                    <a
                        href={trackingUrl}
                        target="_blank" // Open in new tab
                        rel="noopener noreferrer" // Security best practice
                        className="block w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition duration-200 text-center"
                    >
                        Track on {order.shippingMethod?.provider || 'Carrier Website'}
                    </a>
                ) : (
                    // Show message if tracking link couldn't be generated
                    order.trackingNumber && <p className="text-sm text-gray-500 text-center mt-4">Official carrier tracking link could not be generated.</p>
                )}
                {/* Placeholder for more advanced tracking info */}
                {/* <div className="mt-4 border-t pt-4 text-sm text-gray-600">
                     <p>Shipment details will appear here...</p>
                 </div> */}
            </div>
        </div>
    );
}

// Wrap main content component with Suspense for useSearchParams
export default function TrackingPage() {
    return (
        <Suspense fallback={<p className="text-center p-10 text-gray-600">Loading Page...</p>}>
            <TrackingContent />
        </Suspense>
    );
}