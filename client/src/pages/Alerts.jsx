// src/pages/Alerts.jsx
import React, { useEffect, useState } from "react";
import AddAlertDrawer from "../components/AddAlertDrawer";
import EmptyState from "../components/EmptyState";
import { API } from "../services/api";

const Alerts = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch alerts from backend
  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        setAlerts(data);
      } else {
        setAlerts([]);
      }
    } catch (err) {
      console.log(err);
      setAlerts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  // Add new alert
  const addAlert = async (form) => {
    try {
      const res = await fetch(`${API}/alerts/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: form.symbol.toUpperCase(),
          condition: form.condition,
          targetPrice: Number(form.price),
        }),
      });

      if (!res.ok) return alert("Failed to create alert");

      setDrawerOpen(false);
      loadAlerts(); // refresh list
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Alert
  const removeAlert = async (id) => {
    const confirmDelete = window.confirm("Delete alert?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/alerts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return alert("Failed to delete");

      loadAlerts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-gray-500 text-sm">
            Manage your stock alerts
          </p>
        </div>

        <button
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl"
        >
          + Add Alert
        </button>
      </div>

      {/* ALERT TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : alerts.length === 0 ? (
          <EmptyState title="No Alerts" subtitle="Create your first alert." />
        ) : (
          <table className="w-full text-left">
            <thead className="text-gray-500 text-sm border-b">
              <tr>
                <th className="py-2">Stock</th>
                <th>Condition</th>
                <th>Target</th>
                <th>Status</th>
                <th className="text-right">Remove</th>
              </tr>
            </thead>

            <tbody>
              {alerts.map((a) => (
                <tr key={a._id} className="border-b">
                  <td className="py-3 font-semibold">{a.symbol}</td>
                  <td>{a.condition}</td>
                  <td>₹{a.targetPrice}</td>

                  <td
                    className={
                      a.triggered
                        ? "text-green-600 font-semibold"
                        : "text-yellow-600 font-semibold"
                    }
                  >
                    {a.triggered ? "Triggered" : "Pending"}
                  </td>

                  <td className="text-right">
                    <button
                      onClick={() => removeAlert(a._id)}
                      className="text-red-600 hover:text-red-700 text-lg"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer */}
      <AddAlertDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={addAlert}
      />
    </div>
  );
};

export default Alerts;
