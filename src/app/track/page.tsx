"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { client } from '@/sanity/lib/client'; // Adjust path
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Interface matching order structure (adjust as needed)
interface TrackedOrder {
    _id: string;
    orderNumber: string;
    status: string;
    trackingNumber?: string;
    shippingMethod?: {
        provider?: string; // Store carrier name here (e.g., 'FedEx', 'UPS')
    };
    // Add other fields if needed
}

function TrackingContent() {
    const searchParams = useSearchParams();
    const trackingNumberParam = searchParams.get('number');
    const [order, setOrder] = useState<TrackedOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!trackingNumberParam) {
            setError("No tracking number provided in URL.");
            setLoading(false);
            return;
        }

        const fetchOrderByTracking = async () => {
            setLoading(true);
            setError(null);
            try {
                 // Query Sanity by trackingNumber. Add an index in Sanity for performance!
                 const query = `*[_type == "order" && trackingNumber == $trackingNumber][0] {
                    _id,
                    orderNumber,
                    status,
                    trackingNumber,
                    shippingMethod { provider } // Get the carrier/provider
                }`;
                const params = { trackingNumber: trackingNumberParam };
                const data = await client.fetch<TrackedOrder>(query, params);

                if (data) {
                    setOrder(data);
                } else {
                    setError(`No order found with tracking number: ${trackingNumberParam}`);
                }
            } catch (err) {
                console.error("Failed to fetch order by tracking:", err);
                setError("Failed to load tracking details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderByTracking();
    }, [trackingNumberParam]);

     // Function to generate carrier tracking URL
     const getCarrierTrackingUrl = (provider?: string, trackingNumber?: string): string | null => {
        if (!provider || !trackingNumber) return null;
        const p = provider.toLowerCase();
        if (p.includes('fedex')) {
            return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
        } else if (p.includes('ups')) {
            return `https://www.ups.com/track?loc=en_US&tracknum=${trackingNumber}`;
        } else if (p.includes('dhl')) {
             // DHL URLs can vary, use a generic one or be more specific if possible
            return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
        }
        // Add other carriers as needed (USPS, etc.)
        return null; // Return null if carrier is unknown
    };

    const trackingUrl = getCarrierTrackingUrl(order?.shippingMethod?.provider, order?.trackingNumber);


    if (loading) return <p className="text-center p-10">Loading tracking info...</p>;
    if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;
    if (!order) return <p className="text-center p-10">Order not found.</p>;


    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
                <ArrowLeft size={16} className="inline mr-1" /> Back to Home
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-center">Track Your Order</h1>
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <p className="mb-2"><strong>Order Number:</strong> {order.orderNumber}</p>
                <p className="mb-4"><strong>Tracking Number:</strong> {order.trackingNumber}</p>
                <p className="mb-4"><strong>Current Status:</strong> <span className="font-semibold capitalize">{order.status}</span></p>

                {trackingUrl ? (
                    <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 w-full text-center"
                    >
                        Track on {order.shippingMethod?.provider || 'Carrier Website'}
                    </a>
                ) : (
                    <p className="text-sm text-gray-500 text-center">Official carrier tracking link not available.</p>
                )}
                {/* Add more details or embedded tracking widget if using a tracking API */}
            </div>
        </div>
    );
}

export default function TrackingPage() {
    return (
        <Suspense fallback={<p className="text-center p-10">Loading...</p>}>
            <TrackingContent />
        </Suspense>
    );
}