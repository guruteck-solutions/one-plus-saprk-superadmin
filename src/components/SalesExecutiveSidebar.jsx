import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardCheck,
  LogOut,
  X,
  Map,
} from "lucide-react";
import "../css/salesExecutive/SalesExecutiveSidebar.css";

const SalesExecutiveSidebar = ({
  activeMenu,
  isOpen,
  onMenuClick,
  onClose,
}) => {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/sales-executive/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Attendance",
      path: "/sales-executive/attendance",
      icon: ClipboardCheck,
    },
    {
      label: "Beat Plan",
      path: "/sales-executive/beat-plan",
      icon: Map,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sales-executive-sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sales-executive-sidebar ${isOpen ? "sales-executive-sidebar-open" : ""
          }`}
      >
        <div className="sales-executive-sidebar-header">
          <h2>Sales Executive</h2>

          <button
            type="button"
            className="sales-executive-sidebar-close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sales-executive-sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sales-executive-sidebar-item ${activeMenu === item.label
                  ? "sales-executive-sidebar-item-active"
                  : ""
                  }`}
                onClick={onMenuClick}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <button
            type="button"
            className="sales-executive-sidebar-item sales-executive-sidebar-logout"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default SalesExecutiveSidebar;