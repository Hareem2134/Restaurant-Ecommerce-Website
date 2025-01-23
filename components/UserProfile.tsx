
import React from "react";

interface User {
  name: string;
  email: string;
  addresses: string[];
  orders: { id: number }[];
}

const UserProfile: React.FC<{ user?: User }> = ({ user }) => {
  if (!user) {
    return <p>No user data available. Please log in.</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <h3>Saved Addresses</h3>
      <ul>
        {user.addresses.map((address, index) => (
          <li key={index}>{address}</li>
        ))}
      </ul>
      <h3>Order History</h3>
      <ul>
        {user.orders.map((order) => (
          <li key={order.id}>
            <a href={`/orders/${order.id}`}>Order #{order.id}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
