import React, { useState, useEffect } from "react";

const EditHoldingDrawer = ({ open, onClose, data, onSubmit, onDeleteRequest }) => {
  const [qty, setQty] = useState("");
  const [avg, setAvg] = useState("");

  useEffect(() => {
    if (data) {
      setQty(data.qty);
      setAvg(data.avg);
    }
  }, [data]);

  const saveChanges = () => {
    if (!qty || !avg) return;

    onSubmit({
      ...data,        // keep stock name & curr price
      qty: Number(qty),
      avg: Number(avg),
    });

    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Edit Holding</h2>
        <button onClick={onClose} className="text-gray-600 dark:text-gray-300 text-xl cursor-pointer">
          ✖
        </button>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm text-gray-500">Stock</label>
          <div className="mt-1 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            {data?.stock}
          </div>
        </div>

        <div>
          <label className="text-sm">Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="text-sm">Average Price</label>
          <input
            type="number"
            value={avg}
            onChange={(e) => setAvg(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg border dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {/* Save Button */}
        <button onClick={saveChanges} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 cursor-pointer">
          Save Changes
        </button>

        {/* Delete Button */}
        <button onClick={()=>onDeleteRequest(data)} className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer">
            Delete Holding
        </button>
      </div>
    </div>
  );
};

export default EditHoldingDrawer;
