// Handles webhooks (e.g., Stripe events)
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // Verify webhook signature and handle events
    const event = req.body;

    // Process webhook event
    return res.status(200).json({ received: true });
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
