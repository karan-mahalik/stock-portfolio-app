import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const AddHoldingDrawer = ({ open, onClose, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            symbol: e.target.symbol.value.trim(),
            quantity: Number(e.target.quantity.value),
            buyPrice: Number(e.target.buyPrice.value),
        };

        onSubmit(formData);
        onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 p-6 flex flex-col"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 120 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Add Holding
                            </h2>
                            <button onClick={onClose}>
                                <X className="text-gray-700 dark:text-gray-300  cursor-pointer" />
                            </button>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    Stock Symbol
                                </label>
                                <input
                                    name="symbol"
                                    required
                                    placeholder="e.g. TCS"
                                    className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800
                             text-gray-900 dark:text-gray-100 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    Quantity
                                </label>
                                <input
                                    name="quantity"
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="Enter quantity"
                                    className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800
                             text-gray-900 dark:text-gray-100 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    Buy Price
                                </label>
                                <input
                                    name="buyPrice"
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="Enter buy price"
                                    className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800
                             text-gray-900 dark:text-gray-100 outline-none"
                                />
                            </div>

                            <button type="submit" className="mt-4 w-full py-2 rounded-xl bg-blue-600 text-white
                           hover:bg-blue-700 transition-all  cursor-pointer">
                                Add Holding
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddHoldingDrawer;
