import React from "react";
import { Menu, Bell, User } from "lucide-react";
import "../css/salesExecutive/SalesExecutiveNavbar.css";

const SalesExecutiveNavbar = ({ onMenuClick }) => {
  return (
    <header className="sales-executive-navbar">
      <button
        type="button"
        className="sales-executive-menu-btn"
        onClick={onMenuClick}
      >
        <Menu size={22} />
      </button>

      <div className="sales-executive-navbar-title">
        OnePlus Spark Paints
      </div>

      <div className="sales-executive-navbar-actions">
        <button type="button" className="sales-executive-navbar-icon">
          <Bell size={20} />
        </button>

        <button type="button" className="sales-executive-navbar-profile">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default SalesExecutiveNavbar;