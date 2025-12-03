import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import EmptyState from "../components/EmptyState";

const PieAllocation = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <EmptyState
          title="No Allocation Data"
          subtitle="Add holdings to see your portfolio allocation."
        />
      </div>
    );
  }

  const allocation = data.map((h) => ({
    name: h.stock,
    value: h.curr * h.qty,
  }));

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border border-blue-100 dark:border-purple-800/40">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Portfolio Allocation
      </h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={allocation}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {allocation.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieAllocation;
