import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const orderData = await request.json();

  try {
    const order = await client.create({
      _type: "order",
      ...orderData,
      status: "pending",
      date: new Date().toISOString(),
    });

    return NextResponse.json({ orderId: order._id });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}