// src/pages/Settings.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import { useState } from "react";

const Settings = () => {
    const { user, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [loading, setLoading] = useState(false);


    // LOGOUT FUNCTION
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        logout();
        navigate("/");
    };

    //Save changes
    const handleSave = async () => {
        if (!name && !email) {
            alert("Nothing to update!");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/auth/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Update failed");
                return;
            }

            // Update UI + localStorage + context
            localStorage.setItem("user", JSON.stringify(data.user));
            login(data.user); // update AuthContext

            alert("Profile updated successfully!");

        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Deleting your account will permanently remove your data. Continue?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/auth/delete`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            // Clear all local data
            logout();
            navigate("/");

        } catch (error) {
            console.log(error);
            alert("Failed to delete account");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Manage your account and app preferences
            </p>

            {/* PROFILE SECTION */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-blue-50 dark:border-purple-800/40 mb-6">
                <h2 className="font-semibold text-lg mb-4">Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <button onClick={handleSave} className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* NOTIFICATIONS */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow border border-blue-50 dark:border-purple-800/40 mb-6">
                <h2 className="font-semibold text-lg mb-3">Notifications</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                    <span>Email Alerts</span>
                </label>
            </div>

            {/* DANGER ZONE */}
            <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-2xl border border-red-300 dark:border-red-700">
                <h2 className="font-semibold text-lg text-red-700 dark:text-red-400 mb-3">
                    Danger Zone
                </h2>

                <div className="flex flex-col gap-4 mt-6">
                    <button onClick={handleLogout} className="w-full px-5 py-3 rounded-xl bg-red-600 text-white font-medium shadow-sm hover:bg-red-700 transition-all">
                        Logout
                    </button>

                    <button onClick={handleDeleteAccount} className="w-full px-5 py-3 rounded-xl bg-red-700 text-white font-medium shadow-sm hover:bg-red-800 transition-all">
                        Delete Account
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Settings;
