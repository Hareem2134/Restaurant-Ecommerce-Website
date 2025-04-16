// src/app/api/order/create/route.ts

import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  console.log("API Route /api/order/create hit");
  try {
    // 1. Get data sent from the frontend
    const orderDataFromFrontend = await request.json();
    console.log("🔹 Received Order Data from Frontend:", JSON.stringify(orderDataFromFrontend, null, 2));

    // 2. Basic Validation of incoming data
    if (!orderDataFromFrontend || !orderDataFromFrontend.items || !Array.isArray(orderDataFromFrontend.items)) {
      console.error("❌ Invalid order data structure received. 'items' array is missing or invalid.");
      return NextResponse.json({ message: "Invalid order data: 'items' array is missing or invalid." }, { status: 400 });
    }
     // Add checks for other required fields if necessary (e.g., total, addresses)


    // 3. Generate the custom, human-readable Order ID
    // Using the format from the frontend snippet for consistency, but it's generated server-side now.
    const customOrderId = `ORD-${Date.now()}-${uuidv4().substring(0, 4)}`;
    console.log("🔸 Generated Custom Order ID (orderNumber):", customOrderId);

    // 4. Map and Validate Items
    const mappedItems = (orderDataFromFrontend.items || [])
      .map((item: any) => {
        // --- CRITICAL CHECK: Ensure item.id exists and looks like a Sanity ID ---
        // You might add more robust validation here (e.g., regex for UUID format)
        if (!item || typeof item.id !== 'string' || item.id.trim() === '' || typeof item.quantity !== 'number' || item.quantity <= 0 || typeof item.price !== 'number' || typeof item.name !== 'string') {
          console.warn("⏩ Skipping invalid item data (missing id, qty, price, or name):", item);
          return null; // Skip invalid items
        }

        // Assuming item.id IS the Sanity _id of the product ('food' type)
        const productRef = { _type: 'reference', _ref: item.id.trim() };

        return {
          _key: uuidv4(), // Required for array items in Sanity
          product: productRef,
          quantity: item.quantity,
          nameAtPurchase: item.name, // Store name as sent from frontend
          priceAtPurchase: item.price, // Store price as sent from frontend
          // Store image URL if provided and needed
          image: typeof item.image === 'string' ? item.image : null
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null); // Filter out null (skipped) items

    // Log if items were skipped or if none are valid
    if (mappedItems.length !== (orderDataFromFrontend.items || []).length) {
        console.warn("⚠️ Some items were skipped due to missing/invalid data or potentially incorrect product IDs.");
    }
    if (mappedItems.length === 0 && (orderDataFromFrontend.items || []).length > 0) {
         console.error("❌ No valid items could be mapped! Check product IDs being sent from frontend cart.");
         // Return an error as an order without items is usually invalid
         return NextResponse.json({ message: "Could not process order items. Ensure valid product IDs are sent." }, { status: 400 });
    }
    console.log("✅ Items mapped for Sanity:", JSON.stringify(mappedItems, null, 2));


    // 5. Prepare the document for Sanity creation (matching the updated schema)
    const documentToCreate: any = { // Use 'any' or define a strict type matching your schema
      _type: "order",
      orderNumber: customOrderId,
      orderDate: orderDataFromFrontend.orderDate || new Date().toISOString(), // Use date from frontend or generate new
      status: "pending", // Initial status

      // Items array
      items: mappedItems,

      // Financials - use data from frontend, ensure types match schema (number)
      subtotal: Number(orderDataFromFrontend.subtotal) || 0,
      discountAmount: Number(orderDataFromFrontend.discountAmount) || 0,
      discountCode: orderDataFromFrontend.discountCode || null, // Use null if not provided
      shippingCost: Number(orderDataFromFrontend.shippingCost) || 0,
      total: Number(orderDataFromFrontend.total) || 0,

      // Payment
      paymentMethod: orderDataFromFrontend.paymentMethod || 'N/A',
      // transactionId: will be added later via update/webhook

      // Shipping Address - ensure object exists and add _type
      ...(orderDataFromFrontend.shippingAddress && {
          shippingAddress: {
            _type: 'shippingAddress', // Add schema type if defined separately
            street: orderDataFromFrontend.shippingAddress.street,
            address2: orderDataFromFrontend.shippingAddress.address2 || null, // Handle optional field
            city: orderDataFromFrontend.shippingAddress.city,
            state: orderDataFromFrontend.shippingAddress.state,
            zip: orderDataFromFrontend.shippingAddress.zip,
            country: orderDataFromFrontend.shippingAddress.country,
          }
      }),

      // Billing Address - CONDITIONAL based on flag from frontend
      ...(orderDataFromFrontend.billingAddress && orderDataFromFrontend.billingSameAsShipping === false && {
            billingAddress: {
                _type: 'billingAddress', // Add schema type if defined separately
                street: orderDataFromFrontend.billingAddress.street,
                address2: orderDataFromFrontend.billingAddress.address2 || null,
                city: orderDataFromFrontend.billingAddress.city,
                state: orderDataFromFrontend.billingAddress.state,
                zip: orderDataFromFrontend.billingAddress.zip,
                country: orderDataFromFrontend.billingAddress.country,
            }
      }), // If billingSameAsShipping is true or billingAddress is missing, this field is omitted

      // Shipping Method - ensure object exists and add _type
      ...(orderDataFromFrontend.shippingMethod && {
          shippingMethod: {
            _type: 'shippingMethodInfo', // Add schema type if defined separately
            provider: orderDataFromFrontend.shippingMethod.provider,
            service: orderDataFromFrontend.shippingMethod.service,
            cost: Number(orderDataFromFrontend.shippingMethod.cost) || 0, // Ensure number
            estimatedDelivery: orderDataFromFrontend.shippingMethod.estimatedDelivery,
            rateId: orderDataFromFrontend.shippingMethod.rateId,
          }
      }),
       // trackingNumber, shippingLabelUrl will be added later via update
    };

    // 6. Final check: Remove top-level undefined keys (optional but safer)
     Object.keys(documentToCreate).forEach(key => {
        if (documentToCreate[key] === undefined) {
          console.warn(`Removing undefined key before Sanity create: ${key}`);
          delete documentToCreate[key];
        }
      });


    console.log("⏳ Attempting final create document in Sanity:", JSON.stringify(documentToCreate, null, 2));

    // 7. Create the document in Sanity
    // Ensure the client used here has write permissions
    const createdOrder = await client.create(documentToCreate);

    console.log("✅ Sanity document created successfully:", createdOrder);

    // --- IMPORTANT: Return the ACTUAL Sanity Document _id ---
    return NextResponse.json(
        {
            message: "Order created successfully",
            orderId: createdOrder._id // <-- Return the REAL Sanity _id
        },
        { status: 201 } // 201 Created status
    );
    // --- END ---

  } catch (error: any) {
    console.error("❌ Error in /api/order/create:", error);
     // Log detailed error if available
     if (error.response && error.response.body) {
        console.error("📄 Sanity Response Body on Error:", JSON.stringify(error.response.body, null, 2));
     } else if (error.stack) {
         console.error("📄 Error Stack:", error.stack);
     } else {
        console.error("📄 Raw Error:", error);
     }

    return NextResponse.json(
        {
            message: "Failed to create order",
            errorDetails: error.message || 'Unknown server error'
        },
        { status: 500 }
    );
  }
}