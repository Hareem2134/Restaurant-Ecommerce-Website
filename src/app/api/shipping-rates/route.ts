import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache (replace with Redis/etc. for production)
const rateCache = new Map<string, any>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zip, country } = body;

    // Basic Input Validation
    if (!zip || typeof zip !== 'string' || zip.trim().length === 0) {
      return NextResponse.json({ error: "Valid ZIP/Postal code is required" }, { status: 400 });
    }
    if (!country || typeof country !== 'string' || country.trim().length === 0) {
      return NextResponse.json({ error: "Valid Country is required" }, { status: 400 });
    }

    const cacheKey = `${country.toUpperCase()}-${zip.trim()}`;
    const cached = rateCache.get(cacheKey);

    if (cached && cached.timestamp + CACHE_TTL > Date.now()) {
        console.log(`[Cache HIT] Returning cached rates for ${cacheKey}`);
        return NextResponse.json(cached.data, { status: 200 });
    }
     console.log(`[Cache MISS] Calculating rates for ${cacheKey}`);

    // --- Replace with your actual shipping API integration (e.g., Shippo, EasyPost) ---
    // This is just placeholder logic
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    // Simulate different rates based on country/zip or just random for demo
    let baseRate = 20;
    if (country.toUpperCase() === 'CA') baseRate = 25;
    if (zip.startsWith('9')) baseRate = 18; // e.g., US West Coast

    const rates = {
      // Use more descriptive IDs if possible (e.g., 'ups_ground', 'fedex_2day')
      dhl_express: baseRate + 15 + Math.random() * 5,
      fedex_ground: baseRate + 5 + Math.random() * 5,
      ups_standard: baseRate + Math.random() * 5,
    };
    // --- End Placeholder Logic ---

     // Round rates to 2 decimal places
     const roundedRates = Object.entries(rates).reduce((acc, [key, value]) => {
        acc[key] = parseFloat(value.toFixed(2));
        return acc;
      }, {} as Record<string, number>);


    // Store in cache
    rateCache.set(cacheKey, { data: roundedRates, timestamp: Date.now() });
    // Optional: Clean up old cache entries periodically (not shown here)

    // Return the calculated rates
    return NextResponse.json(roundedRates, { status: 200 });

  } catch (error: any) {
    console.error("Error in /api/shipping-rates:", error);
    // Avoid exposing internal details in production
    let errorMessage = "Internal Server Error calculating shipping rates.";
    if (error instanceof SyntaxError) {
        errorMessage = "Invalid request format.";
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}