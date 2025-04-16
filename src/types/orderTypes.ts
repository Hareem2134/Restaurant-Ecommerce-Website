// src/types/orderTypes.ts

export interface OrderDetails {
    _id: string;
    orderNumber: string;
    orderDate: string;
    items?: { // Make items optional initially if fetch might fail
        _key: string;
        nameAtPurchase: string;
        priceAtPurchase: number;
        quantity: number;
    }[];
    subtotal: number;
    discountAmount: number;
    shippingCost: number;
    total: number;
    shippingAddress?: { // Make optional
        street?: string;
        address2?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    paymentMethod?: string;
    status: string;
    transactionId?: string | null; // Allow null
    // --- Add email field ---
    email?: string; // Add the buyer's email field here
    // Add any other fields fetched in getOrderDetails
}

// You can add other order-related types here if needed