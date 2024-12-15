import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import {
  Home,
  CreditCard,
  HelpCircle,
  ChevronsLeft,
  ChevronsRight,
  Scroll,
} from "lucide-react";
import { useState } from "react";
import DashboardHome from "./DashboardHome";
import Transactions from "./Transactions";
import CustomerSupport from "./CustomerSupport";
import Terms from "./Terms";
import { useAuthContext } from "../context/authcontext";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout, getUserData } = useAuthContext();
  const userData = getUserData();

  console.log(userData);

  const navLinks = [
    {
      path: "",
      icon: Home,
      label: "Home",
    },
    {
      path: "transactions",
      icon: CreditCard,
      label: "Transactions",
    },
    {
      path: "support",
      icon: HelpCircle,
      label: "Support",
    },
    {
      path: "terms",
      icon: Scroll,
      label: "terms",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Determine active path
  const getActiveLink = () => {
    const currentPath = location.pathname.split("/").pop();
    return currentPath === "dashboard" ? "" : currentPath;
  };

  return (
    <section className="h-screen overflow-hidden flex bg-[#444CE8]">
      <aside
        className={`
          bg-[#3038E5] 
          h-screen 
          transition-all 
          duration-300 
          ${isCollapsed ? "w-[80px]" : "w-[250px]"}
          flex 
          flex-col 
          relative
          rounded-r-2xl
        `}
      >
        {/* Logo Area */}
        <div className="h-[80px] flex items-center justify-center py-20">
          {isCollapsed ? (
            <div className="text-white text-3xl font-bold">D</div>
          ) : (
            <img
              src="/dashboard-logo.png"
              alt="Dashboard Logo"
              className="w-[173px] h-[56px]"
            />
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex flex-col space-y-2 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={`/dashboard/${link.path}`}
              className={`
                flex 
                items-center 
                p-2 
                rounded-md 
                transition-all 
                ${
                  getActiveLink() === link.path
                    ? "bg-white/20 text-white"
                    : "text-[#648CFF] hover:bg-white/10"
                }
              `}
            >
              <link.icon className="w-6 h-6 mr-3" />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          ))}

          <button onClick={logout}>Logout</button>
        </nav>
      </aside>

      <main
        className={`
          h-screen 
          transition-all 
          duration-300 
          relative
          ${isCollapsed ? "w-[calc(100%-80px)]" : "w-[calc(100%-250px)]"}
        `}
      >
        {/* Chevron Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="
            absolute 
            left-0 
            top-1/2 
            -translate-y-1/2 
            bg-[#3038E5]
            text-white
            p-2 
            rounded-r-full 
            shadow-md
            z-10
          "
        >
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </button>

        {/* Nested Routes for Dashboard */}
        <Routes>
          <Route path="" element={<DashboardHome />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="terms" element={<Terms />} />
        </Routes>
      </main>
    </section>
  );
};

export default Dashboard;
