import React from "react";

import { Bell, Menu, UserCircle } from "lucide-react";

import "../css/painter/PainterNavbar.css";

const PainterNavbar = ({ onMenuClick }) => {
  return (
    <header className="painter-navbar">
      <div className="painter-navbar-left">
        <button
          type="button"
          className="painter-navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="painter-navbar-brand">
          <h2>OnePlus Spark</h2>
          <span>Painter Portal</span>
        </div>
      </div>

      <div className="painter-navbar-right">
        <button
          type="button"
          className="painter-navbar-icon-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <button
          type="button"
          className="painter-navbar-profile"
          title="Profile"
        >
          <UserCircle size={24} />
          <span>Painter</span>
        </button>
      </div>
    </header>
  );
};

export default PainterNavbar;