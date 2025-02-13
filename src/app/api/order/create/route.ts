import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // Import UUID

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const orderId = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`; // ✅ Generate Order ID in API

    console.log("🔹 Received Order Data:", orderData);

    if (!orderData.items || orderData.items.length === 0) {
      console.error("❌ Order items are missing!");
      return NextResponse.json({ error: "Order items cannot be empty" }, { status: 400 });
    }

    const order = await client.create({
      _type: "order",
      orderId, // ✅ Store Order ID in Sanity
      ...orderData,
      status: "pending",
      date: new Date().toISOString(),
    });

    console.log("✅ Order created successfully:", order);
    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
