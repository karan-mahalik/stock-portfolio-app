// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import PieAllocation from "../charts/PieAllocation";
import LineProfitChart from "../charts/LineProfitChart";
import HoldingsTable from "../charts/HoldingsTable";
import { API } from "../services/api";

const Dashboard = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState({
    portfolioValue: 0,
    invested: 0,
    pnl: 0,
    todayChange: 0,
  });

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // Fetch holdings
      const res = await fetch(`${API}/holdings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!Array.isArray(data)) {
        setHoldings([]);
        return;
      }

      // Fetch LIVE prices for each stock
      const updated = await Promise.all(
        data.map(async (h) => {
          const p = await fetch(`${API}/stocks/price/${h.stock}`);
          const info = p.ok ? await p.json() : {};

          return {
            ...h,
            curr: info.price ?? h.avg,
            changePercent: info.changePercent ?? 0,
          };
        })
      );

      setHoldings(updated);

      // --- CALCULATE SUMMARY ---
      const invested = updated.reduce((s, h) => s + h.avg * h.qty, 0);
      const portfolioValue = updated.reduce((s, h) => s + h.curr * h.qty, 0);
      const pnl = portfolioValue - invested;

      // Today's change = (curr price - yesterday price)
      const todayChange = updated.reduce((s, h) => {
        const todayGain = (h.curr - h.avg) * h.qty * (h.changePercent / 100);
        return s + todayGain;
      }, 0);

      setSummary({
        portfolioValue,
        invested,
        pnl,
        todayChange,
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Overview
      </h2>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Portfolio Value */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border border-blue-100 dark:border-purple-800/40">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Portfolio Value</h3>
          <p className="text-2xl font-bold mt-2">
            ₹{summary.portfolioValue.toLocaleString()}
          </p>
        </div>

        {/* Invested */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Investment</h3>
          <p className="text-2xl font-bold mt-2">
            ₹{summary.invested.toLocaleString()}
          </p>
        </div>

        {/* P/L */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Profit / Loss</h3>
          <p
            className={`text-2xl font-bold mt-2 ${
              summary.pnl >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {summary.pnl >= 0 ? "+" : ""}
            ₹{Math.round(summary.pnl).toLocaleString()}
          </p>
        </div>

        {/* Today's Change */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow border">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm">Today’s Change</h3>
          <p
            className={`text-2xl font-bold mt-2 ${
              summary.todayChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {summary.todayChange >= 0 ? "+" : ""}
            ₹{Math.round(summary.todayChange).toLocaleString()}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <PieAllocation data={holdings} />
        <LineProfitChart data={holdings} />
      </div>

      {/* HOLDINGS TABLE */}
      <HoldingsTable data={holdings} loading={loading} />
    </div>
  );
};

export default Dashboard;
