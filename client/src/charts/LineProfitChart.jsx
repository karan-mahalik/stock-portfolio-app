import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmptyState from "../components/EmptyState";

const LineProfitChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <EmptyState
          title="No Chart Data"
          subtitle="Your profit/loss trend will appear here."
        />
      </div>
    );
  }

  const chartData = data.map((h) => ({
    name: h.stock,
    profit: (h.curr - h.avg) * h.qty,
  }));

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border border-blue-100 dark:border-purple-800/40">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Profit / Loss by Stock
      </h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="profit" stroke="#4F46E5" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineProfitChart;
