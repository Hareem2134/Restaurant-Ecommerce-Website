import React from 'react';
import { OrderDetails } from '@/types/orderTypes'; // Define or import your OrderDetails type

// Define props using the IMPORTED interface
interface InvoiceTemplateProps {
  order: OrderDetails; // Use the imported type here
}

// Styles (keep as is or improve)
const styles = `
  body { font-family: sans-serif; font-size: 12px; margin: 0; padding: 0; color: #333; }
  .container { padding: 30px; max-width: 800px; margin: auto; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
  /* ... other styles ... */
`;

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ order }) => {
  const address = order.shippingAddress || {};
  // Ensure you have the 'email' field in OrderDetails type if you need it here
  // const buyerEmail = order.email;

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Invoice #{order.orderNumber}</title>
        <style>{styles}</style>
      </head>
      <body>
        <div className="container">
          {/* Header */}
          <div className="header">
             <h1>Invoice</h1>
             <div className="company-details">
                 <p><strong>FoodTuck</strong></p> {/* Use your company name */}
                 {/* Add your address/contact if needed */}
             </div>
          </div>

          {/* Order Details */}
          <div className="order-details">
             <p><strong>Order Number:</strong> {order.orderNumber}</p>
             <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
             <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
             <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{order.status}</span></p>
             {order.transactionId && <p><strong>Transaction ID:</strong> {order.transactionId}</p>}
          </div>

          {/* Shipping Address */}
          <div className="address-details">
             <p className="section-title">Shipping Address</p>
             <p>{address.street || 'N/A'}</p>
             {address.address2 && <p>{address.address2}</p>}
             <p>{address.city || ''}, {address.state || ''} {address.zip || ''}</p>
             <p>{address.country || ''}</p>
             {/* Display Buyer Email if available and needed on invoice */}
             {/* {buyerEmail && <p>Email: {buyerEmail}</p>} */}
          </div>

          {/* Items Table */}
          <p className="section-title">Order Items</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item) => (
                <tr key={item._key}>
                  <td>{item.nameAtPurchase}</td>
                  <td>{item.quantity}</td>
                  <td className="text-right">${item.priceAtPurchase?.toFixed(2) || '0.00'}</td>
                  <td className="text-right">${(item.quantity * item.priceAtPurchase).toFixed(2)}</td>
                </tr>
              ))}
              {/* Handle case where items array might be empty */}
              {(order.items || []).length === 0 && (
                <tr>
                    <td colSpan={4} style={{textAlign: 'center', fontStyle: 'italic'}}>No items found in order.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals">
             <p>Subtotal: <span className="text-right">${order.subtotal?.toFixed(2) || '0.00'}</span></p>
             {order.discountAmount > 0 && (
                 <p>Discount: <span className="text-right">-${order.discountAmount.toFixed(2)}</span></p>
             )}
             <p>Shipping: <span className="text-right">${order.shippingCost?.toFixed(2) || '0.00'}</span></p>
             <p style={{ fontSize: '14px', borderTop: '1px solid #ccc', paddingTop: '5px' }}>
                 Total: <span className="text-right">${order.total?.toFixed(2) || '0.00'}</span>
             </p>
          </div>

          {/* Footer */}
          <div className="footer">
             <p>Thank you for your order!</p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default InvoiceTemplate;