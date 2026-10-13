import React from "react";
import { Home, MapPinned, Users, ShoppingBag, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/salesExecutive/SalesExecutiveFooter.css";
const SalesExecutiveFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      path: "/sales-executive/dashboard",
    },
    {
      label: "Visits",
      icon: MapPinned,
      path: "/sales-executive/beat-plan",
    },
    {
      label: "Leads",
      icon: Users,
      path: "/sales-executive/leads",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      path: "/sales-executive/order-history",
    },
    {
      label: "Profile",
      icon: User,
      path: "/sales-executive/profile-management",
    },
  ];

  const isActive = (path) => {
    if (path === "/sales-executive/dashboard") {
      return location.pathname === path;
    }

    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <footer className="sales-executive-footer">
      <div className="sales-executive-footer-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              className={`sales-executive-footer-item ${
                isActive(item.path) ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={21} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
};

export default SalesExecutiveFooter;
