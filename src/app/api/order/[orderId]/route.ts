import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract orderId from the request URL
    const url = new URL(req.url);
    const orderId = url.pathname.split("/").pop(); // Get the last segment of the path

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        items[] {
          food->{name, price},
          quantity,
          "image": food->image.asset->url
        },
        subtotal,
        discount,
        shippingCost,
        total,
        shippingAddress,
        paymentMethod
      }`,
      { orderId }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("✅ Order fetched from Sanity:", order);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
