import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import {
  Home,
  CreditCard,
  HelpCircle,
  Scroll,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import DashboardHome from "./DashboardHome";
import Transactions from "./Transactions";
import CustomerSupport from "./CustomerSupport";
import Terms from "./Terms";
import { useAuthContext } from "../context/authcontext";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Collapse state for large screens
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect mobile screens
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile); // Sidebar visibility for small screens

  const location = useLocation();
  const { logout } = useAuthContext();

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      setIsSidebarVisible(!isNowMobile); // Sidebar is always visible on large screens
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { path: "", icon: Home, label: "Home" },
    { path: "transactions", icon: CreditCard, label: "Transactions" },
    { path: "support", icon: HelpCircle, label: "Support" },
    { path: "terms", icon: Scroll, label: "Terms" },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible); // Toggle visibility for small screens
    } else {
      setIsCollapsed(!isCollapsed); // Toggle collapse for large screens
    }
  };

  const getActiveLink = () => {
    const currentPath = location.pathname.split("/").pop();
    return currentPath === "dashboard" ? "" : currentPath;
  };

  return (
    <section className="h-screen overflow-hidden flex bg-[#3038E5] relative">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: isMobile ? "-100%" : 0 }}
        animate={{ x: isSidebarVisible || !isMobile ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.1 }}
        className={`
          ${isMobile ? "absolute z-20" : "static"}
          ${isCollapsed && !isMobile ? "w-[80px]" : "w-[250px]"} 
          h-screen 
          bg-[#3038E5] 
          flex 
          flex-col 
          transition-all 
          duration-300 
          shadow-xl 
          rounded-r-2xl
        `}
      >
        {/* Logo */}
        <div className="h-[80px] flex items-center justify-center py-10 mt-8">
          {isCollapsed && !isMobile ? (
            <img src="/ON.png" alt="" width={56} height={56} />
          ) : (
            <img
              src="/dashboard-logo.png"
              alt="Dashboard Logo"
              className="w-auto h-[56px]"
            />
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex flex-col space-y-2 px-4 text-sm font-monteserat">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={`/dashboard/${link.path}`}
              className={`
                flex items-center p-2 h-[52px] rounded-md transition-all capitalize
                ${
                  getActiveLink() === link.path
                    ? "bg-white/20 text-white"
                    : "text-[#648CFF] hover:bg-white/10"
                }
              `}
            >
              {/* Icon */}
              <div
                className={`w-6 h-6 flex items-center justify-center ${
                  isCollapsed && !isMobile ? "mx-auto" : "mr-3"
                }`}
              >
                <link.icon />
              </div>
              {/* Label */}
              {(!isCollapsed || isMobile) && <span>{link.label}</span>}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="text-[#648CFF] hover:bg-white/10 flex items-center p-2 h-[52px] rounded-md transition-all capitalize"
          >
            {/* Icon */}
            <div
              className={`w-6 h-6 flex items-center justify-center ${
                isCollapsed && !isMobile ? "mx-auto" : "mr-3"
              }`}
            >
              <LogOut />
            </div>
            {/* Label */}
            {(!isCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </nav>
      </motion.aside>

      {/* Toggle Button */}
      <img
        src="/ON.png"
        alt=""
        width={49}
        height={49}
        className="top-[3.3rem] left-4 -translate-y-1/2 bg-[#3038E5] absolute lg:hidden"
      />
      <button
        onClick={toggleSidebar}
        className={`
          absolute 
          ${
            isMobile
              ? "top-8 right-4 bg-white"
              : "top-1/2 left-4 shadow-md shadow-gray-500/50 hover:shadow-gray-100 duration-300 mt-16 -translate-y-1/2 bg-[#3038E5]"
          }
          text-white 
          p-2 
          rounded-full 
          shadow-md 
          z-10
        `}
        aria-label="Toggle Sidebar"
      >
        {isMobile ? (
          isSidebarVisible ? (
            <X className="text-[#3038E5]" />
          ) : (
            <Menu className="text-[#3038E5]" />
          )
        ) : isCollapsed ? (
          <ChevronsRight />
        ) : (
          <ChevronsLeft />
        )}
      </button>

      {/* Main Content */}
      <main
        className={`
          h-screen 
          ${
            isMobile
              ? "w-full"
              : isCollapsed
              ? "w-[calc(100%-80px)]"
              : "w-[calc(100%-250px)]"
          } 
          transition-all 
          duration-300
        `}
      >
        {/* Routes */}
        <Routes>
          <Route path="" element={<DashboardHome />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="terms" element={<Terms />} />
        </Routes>

        {/* Mobile Overlay for Sidebar */}
        {isMobile && isSidebarVisible && (
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setIsSidebarVisible(false)}
          ></div>
        )}
      </main>
    </section>
  );
};

export default Dashboard;
