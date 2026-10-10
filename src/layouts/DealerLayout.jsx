import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import DealerNavbar from "../components/DealerNavbar.jsx";
import DealerSidebar from "../components/DealerSidebar.jsx";
import DealerFooter from "../components/DealerFooter.jsx";

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
    if (location.pathname === "/dealer/dashboard") {
      return "Dashboard";
    }

    if (location.pathname === "/dealer/product-ordering") {
      return "Product Ordering";
    }

    if (location.pathname.startsWith("/dealer/product-ordering/")) {
      return "Product Ordering";
    }

    if (location.pathname === "/dealer/shopping-cart") {
      return "Product Ordering";
    }

    if (location.pathname === "/dealer/order-history") {
      return "Order History & Tracking";
    }

    if (location.pathname.startsWith("/dealer/order-history/")) {
      return "Order History & Tracking";
    }

    if (location.pathname === "/dealer/reward-wallet") {
      return "Rewards & Redemption";
    }

    if (location.pathname === "/dealer/reward-redemption") {
      return "Rewards & Redemption";
    }

    if (location.pathname === "/dealer/reward-redemption-history") {
      return "Rewards & Redemption";
    }

    if (location.pathname.startsWith("/dealer/reward-redemption-history/")) {
      return "Rewards & Redemption";
    }

    if (location.pathname === "/dealer/loyalty-tier") {
      return "Loyalty Tier";
    }

    if (location.pathname === "/dealer/schemes") {
      return "Schemes & Offers";
    }

    if (location.pathname === "/dealer/offers") {
      return "Schemes & Offers";
    }

    if (location.pathname === "/dealer/product-catalogue") {
      return "Product Catalogue";
    }

    if (location.pathname === "/dealer/download-centre") {
      return "Download Center";
    }

    if (location.pathname === "/dealer/painter-enquiries") {
      return "Painter Enquiries";
    }

    if (location.pathname === "/dealer/payment-outstanding") {
      return "Payment & Outstanding";
    }

    if (location.pathname === "/dealer/purchase-analytics") {
      return "Purchase Analytics";
    }

    if (location.pathname === "/dealer/refer-earn") {
      return "Refer & Earn";
    }

    if (location.pathname === "/dealer/notifications") {
      return "Notification";
    }

    if (location.pathname === "/dealer/complaints") {
      return "Complaint Management";
    }

    if (location.pathname === "/dealer/profile") {
      return "Profile & Support";
    }

    if (location.pathname === "/dealer/contact-support") {
      return "Contact Support";
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
      <DealerFooter />
    </div>
  );
};
export default DealerLayout;
