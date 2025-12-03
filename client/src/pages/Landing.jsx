import React from "react";
import { Link } from "react-router-dom";
import { BarChart2, ShieldCheck, Bell, PieChart } from "lucide-react";

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">

            {/* NAV */}
            <header className="flex items-center justify-between px-8 py-5">
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    StockApp
                </h1>

                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-gray-700 dark:text-gray-300 hover:text-indigo-600"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                        Sign Up
                    </Link>
                </div>
            </header>

            {/* HERO */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                    Track Your Stocks <br />
                    <span className="text-indigo-600 dark:text-indigo-400">
                        Smarter & Faster
                    </span>
                </h2>

                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
                    A modern portfolio tracker with real-time analytics, alerts, and insights —
                    built for investors who want clarity, speed, and simplicity.
                </p>

                <Link
                    to="/signup"
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-lg shadow hover:opacity-90"
                >
                    Get Started
                </Link>
            </section>

            {/* FEATURES */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <h3 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10">
                    Powerful Tools for Modern Investors
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 max-w-6xl mx-auto">

                    <FeatureCard
                        icon={<PieChart className="w-8 h-8 text-indigo-600" />}
                        title="Visual Portfolio"
                        description="Clean charts and allocations to understand your investments clearly."
                    />

                    <FeatureCard
                        icon={<Bell className="w-8 h-8 text-purple-600" />}
                        title="Smart Alerts"
                        description="Get notified when stock prices cross your targets."
                    />

                    <FeatureCard
                        icon={<ShieldCheck className="w-8 h-8 text-green-600" />}
                        title="Secure & Private"
                        description="Your data stays safe with industry-grade protection."
                    />

                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} StockApp — Invest Smartly.
            </footer>

        </div>
    );
}

/* Feature Card Component */
const FeatureCard = ({ icon, title, description }) => (
    <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow border border-gray-200 dark:border-gray-600">
        <div className="mb-4">{icon}</div>
        <h4 className="text-lg font-semibold mb-2 dark:text-white">{title}</h4>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
            {description}
        </p>
    </div>
);
export default Landing