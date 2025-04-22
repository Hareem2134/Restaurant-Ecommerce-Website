export interface OrderDetails {
    _id: string;                     // Sanity document ID (string)
    orderNumber: string;             // Your custom order ID (string)
    orderDate: string;               // ISO date string (string)

    items?: {                        // Array of item objects (optional)
        _key: string;
        // product?: { _ref: string }; // Optional: Reference to product document
        nameAtPurchase: string;
        priceAtPurchase: number;
        quantity: number;
        image?: string | null;       // Image URL (string or null)
    }[];

    // Financials (should be numbers)
    subtotal: number;
    discountAmount: number;
    discountCode?: string | null;    // Discount code used (string or null)
    shippingCost: number;
    total: number;

    // Addresses (objects with string properties)
    shippingAddress?: {
        street?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        zip?: string | null;
        country?: string | null;
    } | null; // Allow the whole object to be null

    // Optional: Billing address if different
    // billingAddress?: { /* ... same structure ... */ } | null;

    // Payment & Status
    paymentMethod?: string | null;   // Payment method used (string or null)
    status: string;                  // Order status (string, e.g., 'pending', 'processing')
    transactionId?: string | null;   // Payment transaction ID (string or null)

    // Shipping Details
    shippingMethod?: {               // Shipping method details (object or null)
        provider?: string | null;    // Carrier name (string or null)
        service?: string | null;
        cost?: number | null;
        estimatedDelivery?: string | null;
        rateId?: string | null;
    } | null;

    trackingNumber?: string | null;  // Tracking number is a STRING (or null)
    shippingLabelUrl?: string | null;// Label URL is a STRING (or null)

    // Contact
    email?: string | null;           // Buyer's email (string or null)
}