"use client";

import React, { useState } from "react";

interface Notification {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: Notification["type"]) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
    };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => removeNotification(newNotification.id), 3000);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => addNotification("Item added to cart!", "success")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Success
        </button>
        <button
          onClick={() => addNotification("Error occurred!", "error")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Error
        </button>
        <button
          onClick={() => addNotification("Information updated!", "info")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Info
        </button>
      </div>
      <div className="fixed bottom-4 right-4 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded shadow ${
              notification.type === "success" ? "bg-green-200" :
              notification.type === "error" ? "bg-red-200" : "bg-blue-200"
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
