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
      path: "/painter/barcode-scanner",
    },
    {
      label: "Rewards",
      icon: Gift,
      path: "/painter/rewards",
    },
    {
      label: "Reward Redemption",
      icon: Gift,
      path: "/painter/redemption-dashboard",
    },
    {
      label: "Loyalty Tier",
      icon: Award,
      path: "/painter/loyalty-dashboard",
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
     SCAN & REWARDS SUBMENU
  ===================================================== */

  const scanRewardsItems = [
    // {
    //   label: "Barcode Scanner",
    //   icon: QrCode,
    //   path: "/painter/barcode-scanner",
    // },
    {
      label: "Manual Code Entry",
      icon: QrCode,
      path: "/painter/manual-code-entry",
    },
    {
      label: "Scan Result",
      icon: QrCode,
      path: "/painter/scan-result",
    },
    {
      label: "Invalid QR Popup",
      icon: QrCode,
      path: "/painter/invalid-qr",
    },
    {
      label: "Duplicate QR Popup",
      icon: QrCode,
      path: "/painter/duplicate-qr",
    },
    {
      label: "Scan History",
      icon: QrCode,
      path: "/painter/scan-history",
    },
    {
      label: "Product Verification",
      icon: QrCode,
      path: "/painter/product-verification",
    },
    {
      label: "Reward History",
      icon: Award,
      path: "/painter/reward-history",
    },
    {
      label: "Wallet Ledger",
      icon: FileText,
      path: "/painter/wallet-ledger",
    },
  ];

  /* =====================================================
     REWARDS & ANALYTICS SUBMENU
  ===================================================== */

  const rewardAnalyticsItems = [
    {
      label: "Reward Dashboard",
      icon: Gift,
      path: "/painter/reward-dashboard",
    },
    {
      label: "Reward Wallet",
      icon: Gift,
      path: "/painter/reward-wallet",
    },
    {
      label: "Reward Ledger",
      icon: FileText,
      path: "/painter/reward-ledger",
    },
    {
      label: "Reward Transaction History",
      icon: FileText,
      path: "/painter/reward-transaction-history",
    },
    {
      label: "Reward Analytics",
      icon: Award,
      path: "/painter/reward-analytics",
    },
    {
      label: "Scheme Performance",
      icon: Target,
      path: "/painter/scheme-performance",
    },
  ];

  const redemptionItems = [
    {
      label: "Redemption Dashboard",
      icon: Gift,
      path: "/painter/redemption-dashboard",
    },
    {
      label: "Redeem Rewards",
      icon: Gift,
      path: "/painter/redeem-rewards",
    },
    {
      label: "Redemption Request",
      icon: FileText,
      path: "/painter/redemption-request",
    },
    {
      label: "Redemption History",
      icon: FileText,
      path: "/painter/redemption-history",
    },
    {
      label: "Redemption Status",
      icon: Award,
      path: "/painter/redemption-status",
    },
  ];

  const loyaltyTierItems = [
    {
      label: "Loyalty Dashboard",
      icon: Award,
      path: "/painter/loyalty-dashboard",
    },
    {
      label: "Tier Progress",
      icon: Target,
      path: "/painter/tier-progress",
    },
    {
      label: "Tier Benefits",
      icon: Gift,
      path: "/painter/tier-benefits",
    },
  ];

  const schemesOffersItems = [
    {
      label: "Scheme Listing",
      icon: FileText,
      path: "/painter/scheme-listing",
    },
    {
      label: "Scheme Details",
      icon: FileText,
      path: "/painter/scheme-details",
    },
    {
      label: "Scheme PDF Preview",
      icon: FileText,
      path: "/painter/scheme-pdf-preview",
    },
    {
      label: "Offers Listing",
      icon: Gift,
      path: "/painter/offers-listing",
    },
    {
      label: "Offer Details",
      icon: Gift,
      path: "/painter/offer-details",
    },
  ];

  /* =====================================================
     ACTIVE ROUTES
  ===================================================== */

  const dashboardPaths = [
    "/painter/dashboard",
    ...dashboardItems.map((item) => item.path),
  ];

  const isDashboardSectionActive =
    dashboardPaths.includes(location.pathname);

  const scanRewardsPaths = scanRewardsItems.map(
    (item) => item.path
  );

  const isScanRewardsSectionActive =
    scanRewardsPaths.includes(location.pathname);

  const rewardAnalyticsPaths = rewardAnalyticsItems.map(
    (item) => item.path
  );

  const isRewardAnalyticsSectionActive =
    rewardAnalyticsPaths.includes(location.pathname);

  const redemptionPaths = redemptionItems.map(
    (item) => item.path
  );

  const isRedemptionSectionActive =
    redemptionPaths.includes(location.pathname);

  const loyaltyTierPaths = loyaltyTierItems.map(
    (item) => item.path
  );

  const isLoyaltyTierSectionActive =
    loyaltyTierPaths.includes(location.pathname);

  const schemesOffersPaths = schemesOffersItems.map((item) => item.path);
  const isSchemesOffersSectionActive = schemesOffersPaths.includes(location.pathname);



  /* =====================================================
     DROPDOWN STATE
  ===================================================== */
  const [dashboardOpen, setDashboardOpen] = useState(
    isDashboardSectionActive
  );

  const [scanRewardsOpen, setScanRewardsOpen] = useState(
    isScanRewardsSectionActive
  );

  const [rewardAnalyticsOpen, setRewardAnalyticsOpen] = useState(true);

  const [redemptionOpen, setRedemptionOpen] = useState(true);

  const [loyaltyTierOpen, setLoyaltyTierOpen] = useState(true);

  const [schemesOffersOpen, setSchemesOffersOpen] = useState(true);

  /* =====================================================
     KEEP DROPDOWN OPEN WHEN SUBMENU PAGE IS ACTIVE
  ===================================================== */

  useEffect(() => {
    if (isDashboardSectionActive) {
      setDashboardOpen(true);
    }

    if (isScanRewardsSectionActive) {
      setScanRewardsOpen(true);
    }

    if (isRewardAnalyticsSectionActive) {
      setRewardAnalyticsOpen(true);
    }

    if (isRedemptionSectionActive) {
      setRedemptionOpen(true);
    }

    if (isLoyaltyTierSectionActive) {
      setLoyaltyTierOpen(true);
    }

    if (isSchemesOffersSectionActive) {
      setSchemesOffersOpen(true);
    }
  }, [
    isDashboardSectionActive,
    isScanRewardsSectionActive,
    isRewardAnalyticsSectionActive,
    isRedemptionSectionActive,
    isLoyaltyTierSectionActive,
    isSchemesOffersSectionActive,
  ]);

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
    setDashboardOpen(true);
    handleNavigation(path);
  };

  const handleRewardNavigation = (path) => {
    setRewardAnalyticsOpen(true);
    handleNavigation(path);
  };

  /* =====================================================
     CLOSE MOBILE SIDEBAR
  ===================================================== */

  const handleMobileNavigation = (path) => {
    if (window.innerWidth <= 768) {
      onClose?.();
    }

    handleNavigation(path);
  };

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
        className={`painter-sidebar ${isOpen ? "painter-sidebar-open" : ""
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

              <button
                type="button"
                className={`painter-sidebar-item painter-sidebar-dashboard-item ${isDashboardSectionActive
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

              <button
                type="button"
                className={`painter-sidebar-dropdown-btn ${isDashboardSectionActive
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
                      className={`painter-sidebar-subitem ${isActive
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

            const isScanRewards =
              item.label === "Scan & Rewards";

            const isRewards =
              item.label === "Rewards";

            const isRedemption =
              item.label === "Reward Redemption";

            const isLoyaltyTier =
              item.label === "Loyalty Tier";

            const isSchemesOffers =
              item.label === "Schemes & Offers";

            const isActive = isScanRewards
              ? isScanRewardsSectionActive
              : isRewards
                ? isRewardAnalyticsSectionActive
                : isRedemption
                  ? isRedemptionSectionActive
                  : isLoyaltyTier
                    ? isLoyaltyTierSectionActive
                    : isSchemesOffers
                      ? isSchemesOffersSectionActive
                      : location.pathname === item.path;

            /* =================================================
                SCAN & REWARDS GROUP
            ================================================= */

            if (isScanRewards) {
              return (
                <div
                  className="painter-sidebar-group"
                  key={item.path}
                >
                  <div className="painter-sidebar-dashboard-row">

                    <button
                      type="button"
                      className={`painter-sidebar-item painter-sidebar-dashboard-item ${isActive
                        ? "painter-sidebar-active"
                        : ""
                        }`}
                      onClick={() =>
                        handleMobileNavigation(
                          "/painter/barcode-scanner"
                        )
                      }
                    >
                      <Icon size={18} />
                      <span>Scan & Rewards</span>
                    </button>

                    <button
                      type="button"
                      className={`painter-sidebar-dropdown-btn ${isActive
                        ? "painter-sidebar-dropdown-active"
                        : ""
                        }`}
                      onClick={() =>
                        setScanRewardsOpen(
                          (prev) => !prev
                        )
                      }
                      aria-label="Toggle Scan & Rewards menu"
                      aria-expanded={scanRewardsOpen}
                    >
                      <ChevronDown
                        size={17}
                        className={
                          scanRewardsOpen
                            ? "painter-sidebar-chevron-open"
                            : ""
                        }
                      />
                    </button>

                  </div>

                  {scanRewardsOpen && (
                    <div className="painter-sidebar-submenu">

                      {scanRewardsItems.map(
                        (subItem) => {
                          const SubIcon =
                            subItem.icon;

                          const isSubActive =
                            location.pathname ===
                            subItem.path;

                          return (
                            <button
                              key={subItem.path}
                              type="button"
                              className={`painter-sidebar-subitem ${isSubActive
                                ? "painter-sidebar-subitem-active"
                                : ""
                                }`}
                              onClick={() =>
                                handleMobileNavigation(
                                  subItem.path
                                )
                              }
                            >
                              <SubIcon size={16} />
                              <span>
                                {subItem.label}
                              </span>
                            </button>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>
              );
            }

            /* =================================================
                REWARDS GROUP
            ================================================= */

            if (isRewards) {
              return (
                <div
                  className="painter-sidebar-group"
                  key={item.path}
                >
                  <div className="painter-sidebar-dashboard-row">

                    <button
                      type="button"
                      className={`painter-sidebar-item painter-sidebar-dashboard-item ${isActive
                        ? "painter-sidebar-active"
                        : ""
                        }`}
                      onClick={() =>
                        handleMobileNavigation(
                          "/painter/reward-dashboard"
                        )
                      }
                    >
                      <Icon size={18} />
                      <span>Rewards</span>
                    </button>

                    <button
                      type="button"
                      className={`painter-sidebar-dropdown-btn ${isActive
                        ? "painter-sidebar-dropdown-active"
                        : ""
                        }`}
                      onClick={() =>
                        setRewardAnalyticsOpen(
                          (prev) => !prev
                        )
                      }
                      aria-label="Toggle Rewards menu"
                      aria-expanded={rewardAnalyticsOpen}
                    >
                      <ChevronDown
                        size={17}
                        className={
                          rewardAnalyticsOpen
                            ? "painter-sidebar-chevron-open"
                            : ""
                        }
                      />
                    </button>

                  </div>

                  {rewardAnalyticsOpen && (
                    <div className="painter-sidebar-submenu">

                      {rewardAnalyticsItems.map(
                        (subItem) => {
                          const SubIcon =
                            subItem.icon;

                          const isSubActive =
                            location.pathname ===
                            subItem.path;

                          return (
                            <button
                              key={subItem.path}
                              type="button"
                              className={`painter-sidebar-subitem ${isSubActive
                                ? "painter-sidebar-subitem-active"
                                : ""
                                }`}
                              onClick={() =>
                                handleRewardNavigation(
                                  subItem.path
                                )
                              }
                            >
                              <SubIcon size={16} />
                              <span>
                                {subItem.label}
                              </span>
                            </button>
                          );
                        }
                      )}

                    </div>
                  )}

                </div>
              );
            }

            if (isRedemption) {
              return (
                <div
                  className="painter-sidebar-group"
                  key={item.path}
                >
                  <div className="painter-sidebar-dashboard-row">
                    <button
                      type="button"
                      className={`painter-sidebar-item painter-sidebar-dashboard-item ${isRedemptionSectionActive
                        ? "painter-sidebar-active"
                        : ""
                        }`}
                      onClick={() =>
                        handleMobileNavigation(
                          "/painter/redemption-dashboard"
                        )
                      }
                    >
                      <Icon size={18} />
                      <span>Reward Redemption</span>
                    </button>

                    <button
                      type="button"
                      className={`painter-sidebar-dropdown-btn ${isRedemptionSectionActive
                        ? "painter-sidebar-dropdown-active"
                        : ""
                        }`}
                      onClick={() =>
                        setRedemptionOpen((prev) => !prev)
                      }
                      aria-label="Toggle Reward Redemption menu"
                      aria-expanded={redemptionOpen}
                    >
                      <ChevronDown
                        size={17}
                        className={
                          redemptionOpen
                            ? "painter-sidebar-chevron-open"
                            : ""
                        }
                      />
                    </button>
                  </div>

                  {redemptionOpen && (
                    <div className="painter-sidebar-submenu">
                      {redemptionItems.map((subItem) => {
                        const SubIcon = subItem.icon;

                        const isSubActive =
                          location.pathname === subItem.path;

                        return (
                          <button
                            key={subItem.path}
                            type="button"
                            className={`painter-sidebar-subitem ${isSubActive
                              ? "painter-sidebar-subitem-active"
                              : ""
                              }`}
                            onClick={() =>
                              handleMobileNavigation(subItem.path)
                            }
                          >
                            <SubIcon size={16} />
                            <span>{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            if (isLoyaltyTier) {
              return (
                <div
                  className="painter-sidebar-group"
                  key={item.path}
                >
                  <div className="painter-sidebar-dashboard-row">

                    <button
                      type="button"
                      className={`painter-sidebar-item painter-sidebar-dashboard-item ${isLoyaltyTierSectionActive
                        ? "painter-sidebar-active"
                        : ""
                        }`}
                      onClick={() =>
                        handleMobileNavigation(
                          "/painter/loyalty-dashboard"
                        )
                      }
                    >
                      <Icon size={18} />
                      <span>Loyalty Tier</span>
                    </button>

                    <button
                      type="button"
                      className={`painter-sidebar-dropdown-btn ${isLoyaltyTierSectionActive
                        ? "painter-sidebar-dropdown-active"
                        : ""
                        }`}
                      onClick={() =>
                        setLoyaltyTierOpen((prev) => !prev)
                      }
                      aria-label="Toggle Loyalty Tier menu"
                      aria-expanded={loyaltyTierOpen}
                    >
                      <ChevronDown
                        size={17}
                        className={
                          loyaltyTierOpen
                            ? "painter-sidebar-chevron-open"
                            : ""
                        }
                      />
                    </button>

                  </div>

                  {loyaltyTierOpen && (
                    <div className="painter-sidebar-submenu">

                      {loyaltyTierItems.map((subItem) => {
                        const SubIcon = subItem.icon;

                        const isSubActive =
                          location.pathname === subItem.path;

                        return (
                          <button
                            key={subItem.path}
                            type="button"
                            className={`painter-sidebar-subitem ${isSubActive
                              ? "painter-sidebar-subitem-active"
                              : ""
                              }`}
                            onClick={() =>
                              handleMobileNavigation(
                                subItem.path
                              )
                            }
                          >
                            <SubIcon size={16} />
                            <span>{subItem.label}</span>
                          </button>
                        );
                      })}

                    </div>
                  )}
                </div>
              );
            }

            /* =================================================
    SCHEMES & OFFERS GROUP
================================================= */

            if (isSchemesOffers) {
              return (
                <div
                  className="painter-sidebar-group"
                  key={item.path}
                >
                  <div className="painter-sidebar-dashboard-row">

                    <button
                      type="button"
                      className={`painter-sidebar-item painter-sidebar-dashboard-item ${isSchemesOffersSectionActive
                          ? "painter-sidebar-active"
                          : ""
                        }`}
                      onClick={() =>
                        handleMobileNavigation(
                          "/painter/scheme-listing"
                        )
                      }
                    >
                      <Icon size={18} />
                      <span>Schemes & Offers</span>
                    </button>

                    <button
                      type="button"
                      className={`painter-sidebar-dropdown-btn ${isSchemesOffersSectionActive
                          ? "painter-sidebar-dropdown-active"
                          : ""
                        }`}
                      onClick={() =>
                        setSchemesOffersOpen((prev) => !prev)
                      }
                      aria-label="Toggle Schemes & Offers menu"
                      aria-expanded={schemesOffersOpen}
                    >
                      <ChevronDown
                        size={17}
                        className={
                          schemesOffersOpen
                            ? "painter-sidebar-chevron-open"
                            : ""
                        }
                      />
                    </button>

                  </div>

                  {schemesOffersOpen && (
                    <div className="painter-sidebar-submenu">

                      {schemesOffersItems.map((subItem) => {
                        const SubIcon = subItem.icon;

                        const isSubActive =
                          location.pathname === subItem.path;

                        return (
                          <button
                            key={subItem.path}
                            type="button"
                            className={`painter-sidebar-subitem ${isSubActive
                                ? "painter-sidebar-subitem-active"
                                : ""
                              }`}
                            onClick={() =>
                              handleMobileNavigation(
                                subItem.path
                              )
                            }
                          >
                            <SubIcon size={16} />
                            <span>{subItem.label}</span>
                          </button>
                        );
                      })}

                    </div>
                  )}
                </div>
              );
            }

            /* =================================================
                NORMAL MENU ITEM
            ================================================= */

            return (
              <button
                key={item.path}
                type="button"
                className={`painter-sidebar-item ${isActive
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