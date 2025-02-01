export default {
    name: 'order',
    title: 'Orders',
    type: 'document',
    fields: [
      {
        name: 'user',
        title: 'User',
        type: 'reference',
        to: [{ type: 'user' }]
      },
      {
        name: 'items',
        title: 'Items',
        type: 'array',
        of: [
          {
            type: 'object',
            fields: [
              {
                name: 'food',
                title: 'Food',
                type: 'reference',
                to: [{ type: 'food' }]
              },
              {
                name: 'quantity',
                title: 'Quantity',
                type: 'number'
              },
              {
                name: 'priceAtPurchase',
                title: 'Price at Purchase',
                type: 'number'
              }
            ]
          }
        ]
      },
      {
        name: 'status',
        title: 'Status',
        type: 'string',
        options: {
          list: [
            { title: 'Pending', value: 'pending' },
            { title: 'Processing', value: 'processing' },
            { title: 'Shipped', value: 'shipped' },
            { title: 'Delivered', value: 'delivered' },
            { title: 'Cancelled', value: 'cancelled' }
          ]
        },
        initialValue: 'pending'
      },
      {
        name: 'total',
        title: 'Total Amount',
        type: 'number'
      },
      {
        name: 'shippingAddress',
        title: 'Shipping Address',
        type: 'object',
        fields: [
          { name: 'street', type: 'string' },
          { name: 'city', type: 'string' },
          { name: 'state', type: 'string' },
          { name: 'zip', type: 'string' },
          { name: 'country', type: 'string' }
        ]
      },
      {
        name: 'paymentMethod',
        title: 'Payment Method',
        type: 'string'
      },
      {
        name: 'transactionId',
        title: 'Transaction ID',
        type: 'string'
      }
    ]
  }