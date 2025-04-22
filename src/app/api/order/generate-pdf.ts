import { client } from "@/sanity/lib/client";
import { OrderDetails } from "@/types/orderTypes";

// Inside pages/api/order/generate-pdf.ts
async function getOrderDetails(orderId: string): Promise<OrderDetails | null> {
    const query = `*[_type == "order" && _id == $orderId][0] { /* ... fields ... */ }`;
    const params = { orderId };
    console.log(`[PDF API - getOrderDetails] Fetching with ID: ${orderId}, Query: ${query}`);
    try {
        // Log the client config being used
        console.log('[PDF API - getOrderDetails] Sanity client config:', client.config());
        const order = await client.fetch<OrderDetails>(query, params);
        console.log(`[PDF API - getOrderDetails] Sanity fetch result: ${order ? 'FOUND Document' : 'NOT FOUND'}`);
        if (!order) {
             console.warn(`[PDF API - getOrderDetails] No document found for _id: ${orderId}`);
        }
        return order;
    } catch (fetchError) {
        console.error(`[PDF API - getOrderDetails] Sanity fetch failed for ID ${orderId}:`, fetchError);
        return null;
    }
}