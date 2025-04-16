// src/app/api/order/generate-pdf/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';          // Ensure alias/path is correct
import puppeteer, { Browser, LaunchOptions } from 'puppeteer';
// DO NOT import ReactDOMServer or InvoiceComponent here directly
import { OrderDetails } from '@/types/orderTypes';    // Ensure alias/path is correct
import { sendEmail } from '@/lib/emailSender';        // Ensure alias/path is correct
import { Buffer } from 'buffer';                      // Node's Buffer
// Import the new helper function for rendering HTML
import { renderInvoiceToHtml } from '@/lib/renderInvoiceHtml'; // Ensure alias/path is correct

// Optional: Keep this if you still face issues after structuring, but Option 2 should generally resolve it
// export const dynamic = 'force-dynamic';

// Helper function to fetch order details from Sanity
async function getOrderDetails(orderId: string): Promise<OrderDetails | null> {
    // Ensure your query fetches the 'email' field
    const query = `*[_type == "order" && _id == $orderId][0] {
        _id, orderNumber, orderDate, status, subtotal, discountAmount, shippingCost, total,
        paymentMethod, transactionId, email, // Fetch email
        shippingAddress,
        items[]{ _key, nameAtPurchase, priceAtPurchase, quantity }
    }`;
    console.log(`[PDF API] Fetching order details for ID: ${orderId}`);
    try {
        const order: OrderDetails | null = await client.fetch<OrderDetails>(query, { orderId });
        console.log(`[PDF API] Fetched order details: ${order ? 'Found' : 'Not Found'}`);
        return order;
    } catch (fetchError) {
        console.error(`[PDF API] Error fetching order ${orderId} from Sanity:`, fetchError);
        return null;
    }
}

// API Route Handler for GET requests
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const orderId = searchParams.get('orderId');
  const downloadParam = searchParams.get('download'); // Check if download is forced

  // 1. Validate Input
  if (!orderId) {
    console.error("[PDF API] Error: Missing orderId parameter");
    return NextResponse.json({ error: 'Missing orderId parameter' }, { status: 400 });
  }

  console.log(`[PDF API] Processing PDF & Email request for Order ID: ${orderId}`);
  let browser: Browser | null = null; // Define browser variable accessible in finally

  try {
    // 2. Fetch Order Data
    const order = await getOrderDetails(orderId);
    if (!order) {
      console.error(`[PDF API] Order not found for ID: ${orderId}`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 3. Get Buyer Email (requires 'email' field in OrderDetails and Sanity)
    const buyerEmail = order.email;
    if (!buyerEmail) {
        console.warn(`[PDF API] Buyer email not found for order ${orderId}. Cannot send email.`);
    } else {
        console.log(`[PDF API] Found buyer email: ${buyerEmail}`);
    }

    // 4. Generate Invoice HTML using the dedicated helper function
    console.log("[PDF API] Rendering InvoiceComponent to HTML string via helper...");
    const htmlContent = renderInvoiceToHtml(order);
    console.log("[PDF API] Rendered HTML template successfully.");

    // 5. Launch Puppeteer
    console.log("[PDF API] Launching Puppeteer...");
    // Configure launch options - adjust 'headless' based on your Puppeteer version
    const launchOptions: LaunchOptions = {
        // Option A: For newer Puppeteer (>= v19 approx) - PREFERRED if updated
        // headless: "new",
        // Option B: For older Puppeteer versions (Uncomment if needed, comment out "new")
        headless: true,
        args: [
            '--no-sandbox', // Often required in containerized/serverless environments
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage', // May help prevent memory issues
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            // '--single-process', // uncomment for Vercel Hobby plan, might be needed
            '--disable-gpu' // May help in some environments
        ],
        // Consider setting executablePath if using a specific Chromium build (e.g., with @sparticuz/chromium-min)
        // executablePath: await chromium.executablePath(),
    };
    console.log("[PDF API] Puppeteer Launch Options:", launchOptions);
    browser = await puppeteer.launch(launchOptions);
    console.log("[PDF API] Puppeteer launched successfully.");
    const page = await browser.newPage();
    console.log("[PDF API] Puppeteer page created.");

    // Set content and wait for network activity to settle (important for images/fonts)
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    console.log("[PDF API] HTML content set in Puppeteer page.");

    // 6. Generate PDF Buffer
    console.log("[PDF API] Generating PDF buffer...");
    const pdfArrayBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Include CSS background colors/images
      margin: { top: '25px', right: '25px', bottom: '25px', left: '25px' },
    });
    // Convert the ArrayBuffer from page.pdf() to a Node.js Buffer
    const pdfNodeBuffer = Buffer.from(pdfArrayBuffer);
    console.log(`[PDF API] PDF Buffer generated & converted (size: ${pdfNodeBuffer.length} bytes). Type: Node Buffer`);

    // 7. Send Email with PDF Attachment (if email exists)
    if (buyerEmail) {
        console.log(`[PDF API] Attempting to send email with PDF attachment to ${buyerEmail}...`);
        try {
            const totalString = (order.total ?? 0).toFixed(2); // Safe formatting
            await sendEmail({
                to: buyerEmail,
                subject: `Your FoodTuck Order Invoice (${order.orderNumber})`,
                text: `Thank you for your order! Your invoice (${order.orderNumber}) is attached.\nTotal: $${totalString}\nView Order: ${req.nextUrl.origin}/Order-Confirmation?orderId=${order._id}`,
                html: `<p>Hi there,</p><p>Thank you for your order (<strong>${order.orderNumber}</strong>)! Your invoice is attached.</p><p>Total: <strong>$${totalString}</strong></p><p><a href="${req.nextUrl.origin}/Order-Confirmation?orderId=${order._id}">View your order details online</a>.</p><p>Thanks,<br/>The FoodTuck Team</p>`,
                attachments: [
                    {
                        filename: `Invoice-${order.orderNumber}.pdf`,
                        content: pdfNodeBuffer, // Use the converted Node.js Buffer
                        contentType: 'application/pdf',
                    },
                ],
            });
             console.log(`[PDF API] Email presumably sent successfully to ${buyerEmail}.`);
        } catch (emailError) {
            // Log the email sending error but don't fail the PDF download response
            console.error(`[PDF API] Failed to send invoice email for order ${orderId} to ${buyerEmail}:`, emailError);
        }
    } else {
         console.log("[PDF API] Skipping email send step as no buyer email was found.");
    }

    // 8. Prepare PDF Response Headers
    console.log("[PDF API] Preparing PDF response headers...");
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    // Use orderNumber for filename, fallback to orderId
    const filename = `Invoice-${order.orderNumber || orderId}.pdf`;
    // Set Content-Disposition based on query param to control download/inline view
    if (downloadParam === 'true') {
        console.log("[PDF API] Setting Content-Disposition for forced download.");
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    } else {
        console.log("[PDF API] Setting Content-Disposition for inline view.");
        headers.set('Content-Disposition', `inline; filename="${filename}"`); // Suggest inline view
    }

    // 9. Return the PDF Response
    console.log("[PDF API] Returning PDF response.");
    return new NextResponse(pdfNodeBuffer, { status: 200, headers }); // Return Node.js Buffer

  } catch (error: any) {
    // Catch errors from fetching, HTML rendering, Puppeteer, etc.
    console.error('[PDF API] FATAL Error in generate-pdf route:', error);
    // Return a JSON error response
    return NextResponse.json({ error: 'Failed to generate PDF or process request.', details: error.message }, { status: 500 });
  } finally {
    // 10. Ensure Puppeteer Browser is Closed
    if (browser) {
      console.log("[PDF API] Closing Puppeteer browser in finally block...");
      try {
        await browser.close();
        console.log("[PDF API] Puppeteer browser closed successfully.");
      } catch (closeError) {
        console.error("[PDF API] Error closing Puppeteer browser in finally block:", closeError);
      }
    } else {
        console.log("[PDF API] No active browser instance to close in finally block.");
    }
  }
}