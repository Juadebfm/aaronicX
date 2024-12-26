import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  CreditCard,
  Scroll,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  HandCoins,
  Wallet,
} from "lucide-react";
import DashboardHome from "./DashboardHome";
import Transactions from "./Transactions";
import Terms from "./Terms";
import { useAuthContext } from "../context/authcontext";
import GetCoins from "./Get-Coins";
import RedeemCard from "./RedeemCard";
import Profile from "./Profile";
import LoginHistory from "./LoginHistory";

const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(!isMobile);
  const { getUserData } = useAuthContext();
  const user = getUserData();

  const firstName = user.name.split(" ")[0];
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  const location = useLocation();
  const { logout } = useAuthContext();

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 768;
      setIsMobile(isNowMobile);
      setIsSidebarVisible(!isNowMobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  }, [location.pathname, isMobile]);

  const navLinks = [
    { path: "", icon: Home, label: "Home" },
    { path: "transactions", icon: CreditCard, label: "Transactions" },
    { path: "get-coins", icon: HandCoins, label: "Get Coins" },
    { path: "terms", icon: Scroll, label: "Terms" },
    { path: "login-history", icon: Scroll, label: "Login History" },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const getActiveLink = () => {
    const currentPath = location.pathname.split("/").pop();
    return currentPath === "dashboard" ? "" : currentPath;
  };

  return (
    <section className="h-screen overflow-hidden bg-[#3038E5] relative flex">
      {/* Sidebar */}
      {isSidebarVisible && (
        <motion.aside
          initial={{ x: isMobile ? "-100%" : 0 }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.5 }}
          className={`
            ${isMobile ? "fixed" : "relative"}
            h-screen 
            bg-[#3038E5] 
            shadow-xl 
            rounded-r-2xl
            ${isMobile ? "z-50" : "z-0"}
            ${isCollapsed && !isMobile ? "w-20" : "w-[280px]"}
          `}
        >
          {/* Logo */}
          <div className="h-20 flex items-center justify-center py-10 mt-8">
            {isCollapsed && !isMobile ? (
              <img src="/ON.png" alt="" width={56} height={56} />
            ) : (
              <img
                src="/dashboard-logo.png"
                alt="Dashboard Logo"
                className="w-auto h-14"
              />
            )}
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col flex-grow space-y-2 px-4 pb-14 text-sm font-monteserat">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={`/dashboard/${link.path}`}
                className={`
                  flex items-center p-3 h-[52px] rounded-md transition-all capitalize
                  ${
                    getActiveLink() === link.path
                      ? "bg-white/20 text-white"
                      : "text-[#648CFF] hover:bg-white/10"
                  }
                `}
              >
                <div
                  className={`w-6 h-6 flex items-center justify-center ${
                    isCollapsed && !isMobile ? "mx-auto" : "mr-3"
                  }`}
                >
                  <link.icon />
                </div>
                {(!isCollapsed || isMobile) && <span>{link.label}</span>}
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="text-[#648CFF] hover:bg-white/10 flex items-center p-3 h-[52px] rounded-md transition-all capitalize w-full"
            >
              <div
                className={`w-6 h-6 flex items-center justify-center ${
                  isCollapsed && !isMobile ? "mx-auto" : "mr-3"
                }`}
              >
                <LogOut />
              </div>
              {(!isCollapsed || isMobile) && <span>Logout</span>}
            </button>

            {/* Active profile */}
            <Link
              to="/dashboard/profile"
              className="bg-[#9397B3]/20 p-4 rounded-xl cursor-pointer hover:bg-white/30 transition-colors mb-4 flex items-center gap-2"
            >
              <div
                className={`w-6 h-6 flex items-center justify-center ${
                  isCollapsed && !isMobile ? "mx-auto" : "mr-3"
                }`}
              >
                <Wallet size={26} color="#fff" />
              </div>
              {(!isCollapsed || isMobile) && (
                <div>
                  <small className="uppercase tracking-wider font-light text-[#9397B3] text-[10px]">
                    Active
                  </small>
                  <p className="text-white leading-none">
                    {capitalizedFirstName}'s Wallet
                  </p>
                </div>
              )}
            </Link>
          </nav>

          {/* Collapse/Expand Button */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute -right-10 top-1/2 -translate-y-1/2 bg-[#3038E5] text-white p-2 rounded-r-full shadow-lg z-10 hover:shadow-xl transition-shadow"
              aria-label="Toggle Sidebar"
            >
              {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
            </button>
          )}
        </motion.aside>
      )}

      {/* Mobile Toggle Button */}
      {isMobile && (
        <>
          <img
            src="/ON.png"
            alt=""
            width={49}
            height={49}
            className="fixed top-[3.3rem] left-4 -translate-y-1/2 bg-[#3038E5] z-40 lg:hidden"
          />
          <button
            onClick={toggleSidebar}
            className="fixed top-8 right-4 bg-white text-[#3038E5] p-2 rounded-full shadow-md z-40"
            aria-label="Toggle Sidebar"
          >
            {isSidebarVisible ? <X /> : <Menu />}
          </button>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-auto">
        <Routes>
          <Route path="" element={<DashboardHome />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="get-coins" element={<GetCoins />} />
          <Route path="get-coins/redeem-card" element={<RedeemCard />} />
          <Route path="terms" element={<Terms />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login-history" element={<LoginHistory />} />
        </Routes>
      </main>

      {/* Mobile Overlay */}
      {isMobile && isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarVisible(false)}
        ></div>
      )}
    </section>
  );
};

export default Dashboard;
