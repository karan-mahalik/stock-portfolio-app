import React from "react";
import EmptyState from "../components/EmptyState";

const HoldingsTable = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow mt-6">
        <p className="text-center text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow mt-6">
        <EmptyState
          title="No Holdings Found"
          subtitle="Add stocks to build your portfolio."
          buttonText="Add Holding"
        />
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow mt-6 border border-blue-100 dark:border-purple-800/40">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Holdings
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-gray-800 dark:text-gray-200">
          <thead>
            <tr className="text-gray-600 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-2">Stock</th>
              <th>Qty</th>
              <th>Avg</th>
              <th>Current</th>
              <th>P/L</th>
            </tr>
          </thead>

          <tbody>
            {data.map((h, i) => {
              const pl = (h.curr - h.avg) * h.qty;

              return (
                <tr key={i} className="border-b dark:border-gray-700">
                  <td className="py-2 font-semibold">{h.stock}</td>
                  <td>{h.qty}</td>
                  <td>₹{h.avg}</td>
                  <td>₹{h.curr}</td>
                  <td className={pl >= 0 ? "text-green-600" : "text-red-600"}>
                    {pl >= 0 ? "+" : ""}₹{Math.round(pl)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
