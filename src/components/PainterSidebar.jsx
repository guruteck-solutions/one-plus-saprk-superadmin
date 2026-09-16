import React, { useEffect, useState } from "react";

import {
  Award,
  Bell,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  FileText,
  Gift,
  HelpCircle,
  Home,
  MessageSquare,
  Package,
  QrCode,
  ShoppingBag,
  Star,
  Target,
  UserPlus,
  X,
} from "lucide-react";

import { useLocation } from "react-router-dom";

import "../css/painter/PainterSidebar.css";

const PainterSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  /* =====================================================
     MAIN MENU
  ===================================================== */

  const mainMenuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/painter/dashboard",
    },
    {
      label: "Scan & Rewards",
      icon: QrCode,
      path: "/painter/scan-rewards",
    },
    {
      label: "Rewards",
      icon: Gift,
      path: "/painter/rewards",
    },
    {
      label: "Schemes & Offers",
      icon: Target,
      path: "/painter/schemes-offers",
    },
    {
      label: "Products",
      icon: Package,
      path: "/painter/products",
    },
    {
      label: "Shop",
      icon: ShoppingBag,
      path: "/painter/shop",
    },
    {
      label: "Refer & Earn",
      icon: UserPlus,
      path: "/painter/refer-earn",
    },
    {
      label: "Voice of Painter",
      icon: MessageSquare,
      path: "/painter/voice-of-painter",
    },
    {
      label: "Leads",
      icon: BookOpen,
      path: "/painter/leads",
    },
    {
      label: "Complaints",
      icon: MessageSquare,
      path: "/painter/complaints",
    },
    {
      label: "Downloads",
      icon: FileText,
      path: "/painter/download-centre",
    },
    {
      label: "Analytics",
      icon: Award,
      path: "/painter/analytics",
    },
    {
      label: "Profile",
      icon: Star,
      path: "/painter/profile",
    },
    {
      label: "Support",
      icon: HelpCircle,
      path: "/painter/contact-support",
    },
  ];

  /* =====================================================
     DASHBOARD SUBMENU
  ===================================================== */

  const dashboardItems = [
    {
      label: "Quick Scan",
      icon: QrCode,
      path: "/painter/quick-scan",
    },
    {
      label: "Quick Shop",
      icon: ShoppingBag,
      path: "/painter/quick-shop",
    },
    {
      label: "Quick Rewards",
      icon: Gift,
      path: "/painter/quick-rewards",
    },
    {
      label: "Monthly Reward Summary",
      icon: Award,
      path: "/painter/monthly-reward-summary",
    },
    {
      label: "Notifications",
      icon: Bell,
      path: "/painter/notifications",
    },
  ];

  /* =====================================================
     DASHBOARD ROUTES
  ===================================================== */

  const dashboardPaths = [
    "/painter/dashboard",
    ...dashboardItems.map((item) => item.path),
  ];

  const isDashboardSectionActive =
    dashboardPaths.includes(location.pathname);

  /* =====================================================
     DASHBOARD DROPDOWN STATE
  ===================================================== */

  const [dashboardOpen, setDashboardOpen] = useState(
    isDashboardSectionActive
  );

  /* =====================================================
     KEEP DROPDOWN OPEN WHEN SUBMENU PAGE IS ACTIVE
  ===================================================== */

  useEffect(() => {
    if (isDashboardSectionActive) {
      setDashboardOpen(true);
    }
  }, [isDashboardSectionActive]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  /* =====================================================
     SUBMENU NAVIGATION
  ===================================================== */

  const handleDashboardNavigation = (path) => {
    /*
      Keep Dashboard dropdown open before navigation.
      This prevents visual closing while navigating.
    */

    setDashboardOpen(true);

    handleNavigation(path);
  };

  /* =====================================================
     CLOSE MOBILE SIDEBAR
  ===================================================== */

  const handleMobileNavigation = (path) => {
    /*
      On desktop onClose normally does nothing.
      On mobile it closes the drawer.
    */

    if (window.innerWidth <= 768) {
      onClose?.();
    }

    handleNavigation(path);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* =================================================
          OVERLAY
      ================================================= */}

      {isOpen && (
        <div
          className="painter-sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`painter-sidebar ${
          isOpen ? "painter-sidebar-open" : ""
        }`}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="painter-sidebar-header">
          <div>
            <h2>Painter Portal</h2>
            <span>OnePlus Spark</span>
          </div>

          <button
            type="button"
            className="painter-sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            MENU
        ================================================= */}

        <nav className="painter-sidebar-menu">

          {/* =================================================
              DASHBOARD GROUP
          ================================================= */}

          <div className="painter-sidebar-group">

            <div className="painter-sidebar-dashboard-row">

              {/* Dashboard Button */}

              <button
                type="button"
                className={`painter-sidebar-item painter-sidebar-dashboard-item ${
                  isDashboardSectionActive
                    ? "painter-sidebar-active"
                    : ""
                }`}
                onClick={() =>
                  handleMobileNavigation(
                    "/painter/dashboard"
                  )
                }
              >
                <Home size={18} />

                <span>Dashboard</span>
              </button>

              {/* Dropdown Button */}

              <button
                type="button"
                className={`painter-sidebar-dropdown-btn ${
                  isDashboardSectionActive
                    ? "painter-sidebar-dropdown-active"
                    : ""
                }`}
                onClick={() =>
                  setDashboardOpen((prev) => !prev)
                }
                aria-label="Toggle Dashboard menu"
                aria-expanded={dashboardOpen}
              >
                <ChevronDown
                  size={17}
                  className={
                    dashboardOpen
                      ? "painter-sidebar-chevron-open"
                      : ""
                  }
                />
              </button>
            </div>

            {/* =================================================
                DASHBOARD SUBMENU
            ================================================= */}

            {dashboardOpen && (
              <div className="painter-sidebar-submenu">

                {dashboardItems.map((item) => {
                  const Icon = item.icon;

                  const isActive =
                    location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      type="button"
                      className={`painter-sidebar-subitem ${
                        isActive
                          ? "painter-sidebar-subitem-active"
                          : ""
                      }`}
                      onClick={() =>
                        handleDashboardNavigation(
                          item.path
                        )
                      }
                    >
                      <Icon size={16} />

                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================================
              MAIN MENU
          ================================================= */}

          {mainMenuItems.slice(1).map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                className={`painter-sidebar-item ${
                  isActive
                    ? "painter-sidebar-main-active"
                    : ""
                }`}
                onClick={() =>
                  handleMobileNavigation(item.path)
                }
              >
                <Icon size={18} />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="painter-sidebar-footer">

          <button
            type="button"
            className="painter-sidebar-collapse-btn"
            onClick={onClose}
          >
            <ChevronLeft size={18} />

            <span>Close Menu</span>
          </button>

        </div>
      </aside>
    </>
  );
};

export default PainterSidebar;