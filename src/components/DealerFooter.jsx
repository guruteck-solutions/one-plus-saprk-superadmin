import React from "react";
import { Home, ShoppingBag, Gift, Package, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/dealer/DealerFooter.css";

const DealerFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      path: "/dealer/dashboard",
    },
    {
      label: "Orders",
      icon: ShoppingBag,
      path: "/dealer/order-history",
    },
    {
      label: "Rewards",
      icon: Gift,
      path: "/dealer/reward-wallet",
    },
    {
      label: "Products",
      icon: Package,
      path: "/dealer/product-catalogue",
    },
    {
      label: "Profile",
      icon: User,
      path: "/dealer/profile",
    },
  ];

  const isActive = (path) => {
    if (path === "/dealer/dashboard") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  return (
    <footer className="dealer-footer">
      <div className="dealer-footer-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              type="button"
              className={`dealer-footer-item ${
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

export default DealerFooter;