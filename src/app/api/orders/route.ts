// app/api/orders/route.ts
import { client } from "../../../sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const order = await client.create({
      _type: 'order',
      ...body,
      status: 'pending'
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}