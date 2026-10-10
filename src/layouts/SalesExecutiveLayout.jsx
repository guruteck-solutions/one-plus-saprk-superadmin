import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SalesExecutiveNavbar from "../components/SalesExecutiveNavbar.jsx";
import SalesExecutiveSidebar from "../components/SalesExecutiveSidebar.jsx";
import "../css/salesExecutive/SalesExecutiveLayout.css";

const SalesExecutiveLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleMenuClick = () => setSidebarOpen(false);
  const handleSidebarClose = () => setSidebarOpen(false);

  const getActiveMenu = () => {
    if (location.pathname === "/sales-executive/dashboard") return "Dashboard";

    return "Dashboard";
  };

  return (
    <div className="sales-executive-layout">
      <SalesExecutiveNavbar
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      <SalesExecutiveSidebar
        activeMenu={getActiveMenu()}
        isOpen={sidebarOpen}
        onMenuClick={handleMenuClick}
        onClose={handleSidebarClose}
      />

      <main className="sales-executive-layout-content">
        {children}
      </main>
    </div>
  );
};

export default SalesExecutiveLayout;