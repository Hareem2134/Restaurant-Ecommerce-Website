import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // Create the order in Sanity
    const order = await client.create({
      _type: "order",
      ...orderData,
      status: "pending", // Default status
      date: new Date().toISOString(),
    });

    return NextResponse.json({ orderId: order._id }, { status: 201 });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
