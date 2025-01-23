import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AnalyticsDashboard: React.FC = () => {
  // Mock Data
  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Sales ($)",
        data: [3000, 5000, 4000, 6000, 8000],
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const trafficData = {
    labels: ["Homepage", "Shop", "Product Pages", "Cart", "Checkout"],
    datasets: [
      {
        label: "User Traffic",
        data: [2000, 3000, 1500, 500, 250],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-lg font-semibold mb-2">Sales Data</h3>
          <Line data={salesData} />
        </div>

        {/* Traffic Chart */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <h3 className="text-lg font-semibold mb-2">Traffic Overview</h3>
          <Pie data={trafficData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
