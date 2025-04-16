// pages/api/order/generate-pdf.ts  <-- NOTE THE NEW LOCATION AND FILE STRUCTURE

import type { NextApiRequest, NextApiResponse } from 'next'; // Import types for Pages API
import { client } from '@/sanity/lib/client';          // Adjust path relative to project root OR ensure alias works
import puppeteer, { Browser, LaunchOptions } from 'puppeteer';
import ReactDOMServer from 'react-dom/server'; // This import is OK here
import InvoiceComponent from '../../../components/InvoiceTemplate'; // Adjust path relative to project root OR ensure alias works
import { OrderDetails } from '@/types/orderTypes';    // Adjust path relative to project root OR ensure alias works
import { sendEmail } from '@/lib/emailSender';        // Adjust path relative to project root OR ensure alias works
import { Buffer } from 'buffer';
import React from 'react';

// Helper function (can stay here or move to lib)
async function getOrderDetails(orderId: string): Promise<OrderDetails | null> {
    const query = `*[_type == "order" && _id == $orderId][0] { /* ... query ... */ }`;
    // ... implementation ...
    console.log(`[Pages API] Fetching order details for ID: ${orderId}`);
    try {
        const order: OrderDetails | null = await client.fetch<OrderDetails>(query, { orderId });
        console.log(`[Pages API] Fetched order details: ${order ? 'Found' : 'Not Found'}`);
        return order;
    } catch (fetchError) {
        console.error(`[Pages API] Error fetching order ${orderId} from Sanity:`, fetchError);
        return null;
    }
}

// Default export function for Pages API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse // Use NextApiResponse for sending response
) {
  // Only allow GET method for this endpoint
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Get query parameters from req.query
  const { orderId, download } = req.query;

  if (!orderId || typeof orderId !== 'string') {
    console.error("[Pages API] Error: Missing or invalid orderId parameter");
    return res.status(400).json({ error: 'Missing or invalid orderId parameter' });
  }
  const downloadParam = (download === 'true'); // Convert to boolean

  console.log(`[Pages API] Processing PDF & Email request for Order ID: ${orderId}`);
  let browser: Browser | null = null;

  try {
    // 1. Fetch order details
    const order = await getOrderDetails(orderId);
    if (!order) {
      console.error(`[Pages API] Order not found for ID: ${orderId}`);
      return res.status(404).json({ error: 'Order not found' });
    }

    // 2. Get Buyer Email
    const buyerEmail = order.email;
    if (!buyerEmail) { /* ... warning ... */ } else { /* ... log ... */ }

    // 3. Render Invoice HTML (ReactDOMServer is fine here)
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
        React.createElement(InvoiceComponent, { order: order })
    );
    console.log("[Pages API] Rendered HTML template.");

    // 4. Launch Puppeteer
    console.log("[Pages API] Launching Puppeteer...");
    const launchOptions: LaunchOptions = {
         headless: true,
         args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    };
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // 5. Generate PDF Buffer
    console.log("[Pages API] Generating PDF buffer...");
    const pdfArrayBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { /* ... */ } });
    const pdfNodeBuffer = Buffer.from(pdfArrayBuffer);
    console.log(`[Pages API] PDF Buffer generated & converted (size: ${pdfNodeBuffer.length} bytes).`);

    // 6. Send Email
    if (buyerEmail) {
        console.log(`[Pages API] Attempting to send email to ${buyerEmail}...`);
        try {
            const totalString = (order.total ?? 0).toFixed(2);
            // Construct absolute URL for links in email
            const protocol = req.headers['x-forwarded-proto'] || 'http';
            const host = req.headers.host;
            const baseUrl = `${protocol}://${host}`;

            await sendEmail({
                to: buyerEmail,
                subject: `Your FoodTuck Order Invoice (${order.orderNumber})`,
                text: `... Total: $${totalString}\nView Order: ${baseUrl}/Order-Confirmation?orderId=${order._id}`, // Use absolute URL
                html: `... Total: <strong>$${totalString}</strong> ... <a href="${baseUrl}/Order-Confirmation?orderId=${order._id}">View online</a> ...`, // Use absolute URL
                attachments: [{ filename: `Invoice-${order.orderNumber}.pdf`, content: pdfNodeBuffer, contentType: 'application/pdf' }],
            });
             console.log(`[Pages API] Email presumably sent successfully to ${buyerEmail}.`);
        } catch (emailError) { /* ... error log ... */ }
    } else { /* ... skip log ... */ }

    // 7. Prepare and Send PDF Response using res object
    console.log("[Pages API] Preparing PDF response...");
    res.setHeader('Content-Type', 'application/pdf');
    const filename = `Invoice-${order.orderNumber || orderId}.pdf`;
    if (downloadParam) {
        console.log("[Pages API] Setting Content-Disposition for forced download.");
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    } else {
        console.log("[Pages API] Setting Content-Disposition for inline view.");
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    }

    // Send the buffer
    console.log("[Pages API] Sending PDF response.");
    return res.status(200).send(pdfNodeBuffer); // Use res.send() for buffers

  } catch (error: any) {
    console.error('[Pages API] FATAL Error in generate-pdf route:', error);
    // Ensure browser is closed in case of error before sending response
    if (browser) { try { await browser.close(); } catch (e) { console.error("Error closing browser in catch:", e); } }
    // Send JSON error response
    return res.status(500).json({ error: 'Failed to generate PDF or process request.', details: error.message });
  } finally {
    // Ensure browser is closed if it's still open (e.g., error happened after launch but before close)
    if (browser) {
      console.log("[Pages API] Closing Puppeteer browser in finally block...");
      try { await browser.close(); console.log("[Pages API] Puppeteer browser closed successfully."); }
      catch (closeError) { console.error("[Pages API] Error closing Puppeteer browser in finally block:", closeError); }
    } else { console.log("[Pages API] No active browser instance to close in finally block."); }
  }
}