// src/app/api/order/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client'; // Import the client CONFIGURED WITH THE WRITE TOKEN

export async function PATCH(req: NextRequest) {
  console.log("API Route /api/order/update hit");

  try {
    const body = await req.json();
    // Destructure all expected fields, including transactionId
    const { orderId, trackingNumber, labelUrl, status, transactionId } = body;

    // Validation
    if (!orderId) {
      return NextResponse.json({ message: 'Missing orderId' }, { status: 400 });
    }

    console.log(`Attempting to patch Sanity document ID: ${orderId} with data:`,
        { trackingNumber, labelUrl, status, transactionId } // Log the received txnId
    );

    // --- Perform the Patch Operation ---
    console.log("Using Sanity client config:", client.config());

    const patch = await client
      .patch(orderId)
      .set({
        // Only set fields that have values passed in the request body
        ...(trackingNumber && { trackingNumber }),
        ...(labelUrl && { shippingLabelUrl: labelUrl }),
        ...(status && { status }),
        ...(transactionId && { transactionId }), // <-- Add transactionId to the patch
      })
      .commit({
         // Optional: Helps prevent overwriting newer changes
         // ifRevisionID: body.latestRevisionId // You'd need to fetch and pass this
      });

    console.log("✅ Sanity document patched successfully:", patch);

    return NextResponse.json({ message: 'Order updated successfully', updatedOrder: patch }, { status: 200 });

  } catch (error: any) {
     // ... (error handling as before) ...
     // Make sure error logging includes details
     console.error('❌ Error updating order in Sanity:', error);
     if (error.response && error.response.body) {
        console.error("📄 Sanity Response Body:", JSON.stringify(error.response.body, null, 2));
     } else {
        console.error("📄 Raw Error:", error);
     }
     return NextResponse.json({ message: 'Failed to update order', errorDetails: error.message || 'Unknown error' }, { status: 500 });
  }
}