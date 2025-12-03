// src/pages/Portfolio.jsx
import React, { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import AddHoldingDrawer from "../components/AddHoldingDrawer";
import EditHoldingDrawer from "../components/EditHoldingDrawer";
import EmptyState from "../components/EmptyState";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { API } from "../services/api";

const Portfolio = () => {
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedHolding, setSelectedHolding] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const token = localStorage.getItem("token");

    const colors = [
        "fill-indigo-500",
        "fill-purple-500",
        "fill-green-500",
        "fill-pink-500",
        "fill-yellow-500",
        "fill-blue-500"
    ];

    // Load holdings + live price
    const loadHoldings = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/holdings`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (!Array.isArray(data)) return setHoldings([]);

            // Fetch live market price per stock
            const updated = await Promise.all(
                data.map(async (h) => {
                    const p = await fetch(`${API}/stocks/price/${h.stock}`);
                    const info = p.ok ? await p.json() : {};

                    return {
                        ...h,
                        curr: info.price ?? h.avg, // if price unavailable, fallback to avg
                    };
                })
            );

            setHoldings(updated);
        } catch {
            setHoldings([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadHoldings();
    }, []);

    // Add holding
    const handleAddHolding = async (form) => {
        const body = {
            stock: form.symbol.toUpperCase(),
            qty: form.quantity,
            avg: form.buyPrice,
        };

        const res = await fetch(`${API}/holdings/add`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) return alert("Failed to add");

        setDrawerOpen(false);
        loadHoldings();
    };

    // Update holding
    const handleUpdateHolding = async (updated) => {
        const res = await fetch(`${API}/holdings/edit/${updated._id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                qty: updated.qty,
                avg: updated.avg,
            }),
        });

        if (!res.ok) return alert("Failed to update");

        setEditOpen(false);
        loadHoldings();
    };

    // Delete holding
    const deleteHolding = async () => {
        const res = await fetch(`${API}/holdings/delete/${deleteTarget._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) return alert("Failed to delete");

        setDeleteOpen(false);
        loadHoldings();
    };

    // Portfolio metrics
    const invested = holdings.reduce((sum, h) => sum + h.avg * h.qty, 0);
    const currentValue = holdings.reduce((sum, h) => sum + h.curr * h.qty, 0);
    const profit = currentValue - invested;

    const allocation = holdings.map((h) => ({
        name: h.stock,
        value: h.curr * h.qty,
    }));

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">My Portfolio</h1>
                    <p className="text-gray-500">Your investment performance</p>
                </div>

                <button
                    onClick={() => setDrawerOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-2"
                >
                    <Plus size={16} /> Add Holding
                </button>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Portfolio Value</p>
                    <h2 className="text-2xl font-bold">₹{currentValue.toLocaleString()}</h2>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Invested</p>
                    <h2 className="text-2xl font-bold">₹{invested.toLocaleString()}</h2>
                </div>

                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">Profit / Loss</p>
                    <h2
                        className={`text-2xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()}
                    </h2>
                </div>
            </div>

            {/* CHART + TABLE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 mt-8 gap-6">


                {/* PIE CHART */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                    <h3 className="font-semibold mb-4">Allocation</h3>

                    {allocation.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    dataKey="value"
                                    data={allocation}
                                    nameKey="name"
                                    outerRadius={90}
                                    label={(entry) => entry.name}
                                >
                                    {allocation.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={[
                                                "#4F46E5",
                                                "#A855F7",
                                                "#10B981",
                                                "#EC4899",
                                                "#F59E0B",
                                                "#3B82F6",
                                            ][i % 6]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500">No data</p>
                    )}
                </div>


                {/* HOLDINGS TABLE */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow col-span-2">
                    <h3 className="font-semibold mb-4">Holdings</h3>

                    {holdings.length === 0 ? (
                        <EmptyState
                            title="No Holdings"
                            subtitle="Add your first investment"
                            buttonText="Add Holding"
                            onButtonClick={() => setDrawerOpen(true)}
                        />
                    ) : (
                        <table className="w-full text-left">
                            <thead className="text-gray-500 text-sm">
                                <tr>
                                    <th className="py-2">Stock</th>
                                    <th>Qty</th>
                                    <th>Avg</th>
                                    <th>Current</th>
                                    <th>P/L</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {holdings.map((h, i) => {
                                    const pl = (h.curr - h.avg) * h.qty;

                                    return (
                                        <tr key={i} className="border-b text-gray-700 dark:text-gray-300">
                                            <td className="py-3 font-semibold">{h.stock}</td>
                                            <td>{h.qty}</td>
                                            <td>₹{h.avg}</td>
                                            <td>₹{h.curr}</td>
                                            <td className={pl >= 0 ? "text-green-600" : "text-red-600"}>
                                                {pl >= 0 ? "+" : ""}₹{pl}
                                            </td>

                                            <td>
                                                <button
                                                    onClick={() => {
                                                        setSelectedHolding(h);
                                                        setEditOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* DELETE MODAL */}
            {deleteOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 w-80 p-6 rounded-xl shadow-xl">
                        <h2 className="text-lg font-semibold">Delete Holding</h2>
                        <p className="text-gray-500 mt-2">
                            Delete <b>{deleteTarget.stock}</b>?
                        </p>

                        <div className="flex justify-end mt-6 gap-3">
                            <button
                                onClick={() => setDeleteOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={deleteHolding}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DRAWERS */}
            <AddHoldingDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleAddHolding}
            />

            <EditHoldingDrawer
                open={editOpen}
                onClose={() => setEditOpen(false)}
                data={selectedHolding}
                onSubmit={handleUpdateHolding}
                onDeleteRequest={(h) => {
                    setDeleteTarget(h);
                    setDeleteOpen(true);
                }}
            />
        </div>
    );
};

export default Portfolio;
