// src/sanity/schemaTypes/order.ts

export default {
  name: "order",
  type: "document",
  title: "Order",
  fields: [
    // --- Core Order Identifiers ---
    {
      name: "orderNumber", // Field for your custom ORD-... ID
      type: "string",
      title: "Order Number",
      readOnly: true, // Often best to make this read-only in the Studio
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "orderDate", // Consistent naming
      type: "datetime",
      title: "Order Date",
      readOnly: true,
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm:ss',
        timeStep: 15,
        calendarTodayLabel: 'Today'
      },
      validation: (Rule: any) => Rule.required(),
    },

    // --- Items ---
    {
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            // Use 'product' to match API
            {
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "food" }] // Assuming your product type is 'food'
            },
            { name: "quantity", type: "number", title: "Quantity" },
            // Add fields stored at purchase time
            { name: "nameAtPurchase", type: "string", title: "Name at Purchase" },
            { name: "priceAtPurchase", type: "number", title: "Price at Purchase" },
            { name: "image", type: "string", title: "Image URL at Purchase" }, // Store image URL if needed
          ],
          // Optional: Preview configuration for better Studio display
          preview: {
            select: {
              title: 'nameAtPurchase',
              quantity: 'quantity',
              price: 'priceAtPurchase',
              media: 'product.image' // Example if product has an image field
            },
            prepare(selection: any) {
              const { title, quantity, price } = selection;
              return {
                title: title || 'Unknown Item',
                subtitle: `Qty: ${quantity || '?'} @ $${price?.toFixed(2) || '?'}`,
                // media: selection.media // Uncomment if fetching media
              }
            }
          }
        },
      ],
    },

    // --- Financials ---
    { name: "subtotal", type: "number", title: "Subtotal", readOnly: true },
    {
      name: "discountAmount", // Renamed from 'discount'
      type: "number",
      title: "Discount Amount", // Changed title
      readOnly: true
    },
    {
      name: "discountCode", // Added field
      type: "string",
      title: "Discount Code Used", // Changed title
      readOnly: true
    },
    { name: "shippingCost", type: "number", title: "Shipping Cost", readOnly: true },
    { name: "total", type: "number", title: "Total", readOnly: true },

    // --- Status & Payment ---
    {
      name: "status",
      type: "string",
      title: "Order Status", // Changed title
      options: { // Add options list for controlled vocabulary
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Refunded", value: "refunded" },
          // Add other statuses as needed
        ],
        layout: 'radio' // Or 'dropdown'
      },
      initialValue: 'pending'
    },
    { name: "paymentMethod", type: "string", title: "Payment Method", readOnly: true },
    { name: "transactionId", type: "string", title: "Transaction ID", readOnly: true }, // Often added after payment confirmation

    // --- Addresses ---
    {
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "street", type: "string", title: "Street" },
        { name: "address2", type: "string", title: "Apt, Suite, etc." }, // Added address2
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State" },
        { name: "zip", type: "string", title: "ZIP Code" },
        { name: "country", type: "string", title: "Country" },
      ],
    },
    {
      name: "billingAddress", // Added field
      title: "Billing Address",
      type: "object", // Assuming same structure as shipping for now
      hidden: ({document}: any) => document?.shippingAddress?.billingSameAsShipping, // Example conditional visibility
      fields: [ // Define fields even if hidden, or reference another type
        { name: "street", type: "string", title: "Street" },
        { name: "address2", type: "string", title: "Apt, Suite, etc." },
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State" },
        { name: "zip", type: "string", title: "ZIP Code" },
        { name: "country", type: "string", title: "Country" },
      ],
      // Consider adding a boolean 'billingSameAsShipping' to shippingAddress
      // to control whether this field is populated/shown.
    },


    // --- Shipping & Tracking ---
    {
      name: "shippingMethod",
      type: "object",
      title: "Shipping Method",
      fields: [
        { name: "provider", type: "string", title: "Carrier" },
        { name: "service", type: "string", title: "Service Level" },
        { name: "cost", type: "number", title: "Shipping Cost" }, // Note: duplicate info, maybe remove top-level shippingCost?
        { name: "estimatedDelivery", type: "string", title: "Estimated Delivery" },
        { name: "rateId", type: "string", title: "Rate ID" } // Added rateId
      ]
    },
    {
      name: "trackingNumber", // Added top-level field
      type: "string",
      title: "Tracking Number",
      options: {
        isHighlighted: true // Makes it more prominent if desired
      },
      // Add index for faster lookups
      validation: (Rule: any) => Rule.custom((trackingNumber: any, context: any) => {
        if (!trackingNumber) return true; // Allow empty tracking number
        // Check for uniqueness if desired (can be complex across documents)
        // const { getClient } = context;
        // const client = getClient({ apiVersion: '2023-01-01' }); // Use appropriate API version
        // return client.fetch(`!defined(*[_type == "order" && trackingNumber == $trackingNumber && _id != $id][0]._id)`, { trackingNumber, id: context.document._id })
        //   .then((isUnique: boolean) => isUnique ? true : 'Tracking number must be unique');
        return true; // Basic validation
      }),
       // ---> ADD THIS INDEX <---
      searchTerms: [ 'trackingNumber' ] // Optional: helps with Studio search
    },
    {
      name: "shippingLabelUrl", // Added top-level field
      type: "url", // Use URL type
      title: "Shipping Label URL",
    },
    // Removed trackingInfo object and shippingStatus as they are covered by top-level fields now
  ],

  // Improve Studio Preview
  preview: {
    select: {
      title: 'orderNumber',
      subtitle: 'orderDate',
      status: 'status'
    },
    prepare(selection: any) {
      const { title, subtitle, status } = selection;
      return {
        title: title || 'New Order',
        subtitle: `${new Date(subtitle).toLocaleDateString()} - Status: ${status || 'N/A'}`
      }
    }
  }
};