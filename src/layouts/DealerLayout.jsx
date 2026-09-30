import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import DealerNavbar from "../components/DealerNavbar.jsx";
import DealerSidebar from "../components/DealerSidebar.jsx";

import "../css/dealer/DealerLayout.css";

const DealerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleMenuClick = () => {
    setSidebarOpen(false);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const getActiveMenu = () => {
    if (location.pathname === "/dealer/product-ordering") {
      return "Product Ordering";
    }

    if (location.pathname === "/dealer/shopping-cart") {
      return "Product Ordering";
    }

    if (location.pathname === "/dealer/order-history") {
      return "Order History & Tracking";
    }

    if (location.pathname === "/dealer/dashboard") {
      return "Dashboard";
    }

    return "Dashboard";
  };

  return (
    <div className="dealer-layout">
      <DealerNavbar
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />

      <DealerSidebar
        activeMenu={getActiveMenu()}
        isOpen={sidebarOpen}
        onMenuClick={handleMenuClick}
        onClose={handleSidebarClose}
      />

      <main className="dealer-layout-content">
        {children}
      </main>
    </div>
  );
};

export default DealerLayout;