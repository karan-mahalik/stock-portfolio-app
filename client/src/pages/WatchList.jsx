// src/pages/WatchList.jsx
import React, { useEffect, useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { API } from "../services/api";

const WatchList = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token");

  // Debounce function
  const debounce = (fn, delay = 350) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  useEffect(() => {
    loadWatchlist();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Load watchlist from backend
  const loadWatchlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!Array.isArray(data)) return setWatchlist([]);

      const formatted = data.map((item) => ({
        symbol: item.symbol.toUpperCase(),
        price: null,
        changePercent: null,
        loading: true,
      }));

      setWatchlist(formatted);
      fetchLivePrices(formatted);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Fetch live prices for list
  const fetchLivePrices = async (list) => {
    try {
      const promises = list.map((i) =>
        fetch(`${API}/stocks/price/${i.symbol}`).then((r) =>
          r.ok ? r.json() : null
        )
      );

      const results = await Promise.all(promises);

      const updated = list.map((it, idx) => {
        const p = results[idx];
        if (!p) {
          return { ...it, loading: false };
        }

        return {
          ...it,
          price: p.price ?? null,
          changePercent: p.changePercent ?? null,
          loading: false,
        };
      });

      setWatchlist(updated);
    } catch (err) {
      console.error("Price fetch error", err);
    }
  };

  // Search stocks
  const searchStocks = debounce(async (value) => {
    if (!value.trim()) return setSuggestions([]);

    try {
      const res = await fetch(`${API}/stocks/search?q=${value}`);
      const data = await res.json();

      setSuggestions(data.slice(0, 8));
    } catch {
      setSuggestions([]);
    }
  }, 300);

  // Handle input change
  const handleInput = (value) => {
    setQuery(value);
    searchStocks(value);
  };

  // Add a stock to watchlist
  const addSymbol = async (symbol) => {
    if (!symbol || adding) return;

    setAdding(true);
    setError("");

    try {
      const res = await fetch(`${API}/watchlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol: symbol.toUpperCase() }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to add");
        setAdding(false);
        return;
      }

      const newItem = {
        symbol: symbol.toUpperCase(),
        price: null,
        changePercent: null,
        loading: true,
      };

      setWatchlist((prev) => [newItem, ...prev]);
      setQuery("");
      setSuggestions([]);

      const priceRes = await fetch(`${API}/stocks/price/${symbol}`);
      const priceData = priceRes.ok ? await priceRes.json() : null;

      setWatchlist((prev) =>
        prev.map((item) =>
          item.symbol === newItem.symbol
            ? {
                ...item,
                price: priceData?.price ?? null,
                changePercent: priceData?.changePercent ?? null,
                loading: false,
              }
            : item
        )
      );
    } catch (err) {
      setError("Network error.");
    } finally {
      setAdding(false);
    }
  };

  // Remove symbol
  const removeSymbol = async (symbol) => {
    const confirm = window.confirm(`Remove ${symbol}?`);
    if (!confirm) return;

    const res = await fetch(`${API}/watchlist/${symbol}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setWatchlist((prev) => prev.filter((i) => i.symbol !== symbol));
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Watchlist</h1>
          <p className="text-gray-500 text-sm">Track real-time market data</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-4 relative" ref={dropdownRef}>
        <input
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Search stocks (AAPL, TSLA, INFY)"
          className="px-4 py-2 w-full rounded-xl bg-gray-100 dark:bg-gray-800 border"
        />

        {suggestions.length > 0 && (
          <div className="absolute mt-2 bg-white dark:bg-gray-800 border rounded-xl shadow-lg w-full z-40">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="px-4 py-3 flex justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => addSymbol(s.symbol)}
              >
                <div>
                  <div className="font-semibold">{s.symbol}</div>
                  <div className="text-gray-500 text-xs">{s.name}</div>
                </div>
                <div className="text-xs text-gray-400">{s.exchange}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : watchlist.length === 0 ? (
          <EmptyState
            title="Watchlist Empty"
            subtitle="Search and add stocks to start tracking"
            buttonText="Add Stock"
          />
        ) : (
          <table className="w-full">
            <thead className="text-gray-500 text-sm">
              <tr className="text-left">
                <th className="py-2">Stock</th>
                <th>Price</th>
                <th>Change %</th>
                <th className="text-right">Remove</th>
              </tr>
            </thead>

            <tbody>
              {watchlist.map((w, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-3 font-semibold">{w.symbol}</td>

                  <td>
                    {w.loading ? "..." : w.price !== null ? `₹${w.price}` : "—"}
                  </td>

                  <td
                    className={
                      w.changePercent > 0
                        ? "text-green-600 font-semibold"
                        : "text-red-600 font-semibold"
                    }
                  >
                    {w.loading
                      ? "..."
                      : w.changePercent !== null
                      ? `${w.changePercent.toFixed(2)}%`
                      : "—"}
                  </td>

                  <td className="text-right">
                    <button
                      className="p-2 bg-red-500/10 text-red-600 rounded-lg"
                      onClick={() => removeSymbol(w.symbol)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WatchList;
