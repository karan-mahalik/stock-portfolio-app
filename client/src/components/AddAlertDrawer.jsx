// src/components/AddAlertDrawer.jsx
import React, { useState } from "react";

const AddAlertDrawer = ({ open, onClose, onSubmit }) => {
  const [symbol, setSymbol] = useState("");
  const [condition, setCondition] = useState("above");
  const [price, setPrice] = useState("");

  const handleSubmit = () => {
    if (!symbol.trim() || !price) {
      alert("Enter valid details");
      return;
    }

    onSubmit({
      symbol,
      condition,
      price,
    });

    setSymbol("");
    setPrice("");
  };

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 border-b flex justify-between">
        <h2 className="text-lg font-semibold">Add Alert</h2>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="p-4 space-y-4">

        {/* Stock */}
        <div>
          <label className="text-sm">Symbol</label>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            placeholder="AAPL"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="text-sm">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="text-sm">Target Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700"
            placeholder="Enter price"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg"
        >
          Add Alert
        </button>
      </div>
    </div>
  );
};

export default AddAlertDrawer;
