import React from "react";
import { Menu, Bell } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import Alerts from "../pages/Alerts";

const Navbar = ({ setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate()

  const titles = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/portfolio": "Portfolio",
    "/watchlist": "Watchlist",
    "/settings": "Settings",
  };
  const title = titles[location.pathname] || "Dashboard";

  return (
    <header className=" flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg
    ">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="lg:hidden p-2 rounded-md bg-white/20 hover:bg-white/30"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold tracking-wide">{title}</h1>
          <span className="text-xs bg-white/30 px-2 py-0.5 rounded">
            beta
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button onClick={()=>navigate('/alerts')} className="hidden md:inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="text-sm"></span>
        </button>

        <div>
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}

export default Navbar
