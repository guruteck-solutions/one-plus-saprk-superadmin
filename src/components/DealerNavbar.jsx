import React from "react";
import { Bell, Menu, UserCircle } from "lucide-react";
import "../css/dealer/DealerNavbar.css";

const DealerNavbar = ({ onMenuClick }) => {
  return (
    <header className="dealer-navbar">
      <div className="dealer-navbar-left">
        <button
          type="button"
          className="dealer-navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="dealer-navbar-brand">
          <h2>OnePlus Spark</h2>
          <span>Dealer Portal</span>
        </div>
      </div>

      <div className="dealer-navbar-right">
        <button
          type="button"
          className="dealer-navbar-icon-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <button
          type="button"
          className="dealer-navbar-profile"
          title="Profile"
        >
          <div className="dealer-navbar-profile-image">
            <UserCircle size={24} />
          </div>

          <span>Dealer</span>
        </button>
      </div>
    </header>
  );
};

export default DealerNavbar;