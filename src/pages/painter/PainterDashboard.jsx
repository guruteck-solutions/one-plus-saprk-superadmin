import React, { useEffect, useState } from "react";
import {
  Award,
  Bell,
  Gift,
  QrCode,
  ShoppingBag,
  Star,
} from "lucide-react";
import "../../css/painter/PainterDashboard.css";

const PainterDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    painter: null,
    summary: {
      totalRewardPoints: 0,
      totalCashRewards: 0,
      pendingRewards: 0,
      productScans: 0,
    },
    latestReward: null,
    monthlyRewardSummary: [],
    activeSchemes: [],
  });

  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/painter/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Painter dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const {
    painter,
    summary,
    latestReward,
    monthlyRewardSummary,
    activeSchemes,
  } = dashboardData;

  return (
    <div className="painter-dashboard">

      {/* Page Header */}
      <div className="painter-dashboard-header">
        <div>
          <h1>Painter Dashboard / Home</h1>
          <p>Oneplus Spark PAINTS • Painter experience</p>
        </div>

        <button
          type="button"
          className="painter-notification-btn"
          title="Notifications"
        >
          <Bell size={19} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="painter-summary-grid">

        <div className="painter-summary-card">
          <div className="painter-summary-icon">
            <Star size={18} />
          </div>

          <div className="painter-summary-content">
            <span>Reward Points</span>

            <strong>
              {summary?.totalRewardPoints || 0}
            </strong>

            <small>-</small>
          </div>
        </div>

        <div className="painter-summary-card">
          <div className="painter-summary-icon">
            <Gift size={18} />
          </div>

          <div className="painter-summary-content">
            <span>Cash Rewards</span>

            <strong>
              ₹
              {Number(
                summary?.totalCashRewards || 0
              ).toLocaleString()}
            </strong>

            <small>-</small>
          </div>
        </div>

        <div className="painter-summary-card">
          <div className="painter-summary-icon">
            <Award size={18} />
          </div>

          <div className="painter-summary-content">
            <span>Pending Rewards</span>

            <strong>
              {summary?.pendingRewards || 0}
            </strong>

            <small className="pending-text">
              -
            </small>
          </div>
        </div>

        <div className="painter-summary-card">
          <div className="painter-summary-icon">
            <QrCode size={18} />
          </div>

          <div className="painter-summary-content">
            <span>Product Scans</span>

            <strong>
              {summary?.productScans || 0}
            </strong>

            <small>-</small>
          </div>
        </div>

      </div>

      {/* Middle Section */}
      <div className="painter-dashboard-middle">

        {/* Quick Actions */}
        <section className="painter-dashboard-card painter-quick-card">

          <h2>Quick Actions</h2>

          <div className="painter-quick-actions">

            <button
              type="button"
              className="painter-quick-action active"
            >
              <QrCode size={16} />
              <span>Scan Product</span>
            </button>

            <button
              type="button"
              className="painter-quick-action"
            >
              <ShoppingBag size={16} />
              <span>Shop Products</span>
            </button>

            <button
              type="button"
              className="painter-quick-action"
            >
              <Star size={16} />
              <span>My Rewards</span>
            </button>

          </div>

          {/* Loyalty Tier */}
          <div className="painter-loyalty-row">

            <span className="painter-loyalty-label">
              Current Loyalty Tier
            </span>

            <span className="painter-loyalty-badge">
              {painter?.loyaltyTier || "-"}
            </span>

            <strong>
              {painter?.loyaltyProgress
                ? `${painter.loyaltyProgress}% to ${
                    painter.nextTier || "-"
                  }`
                : "-"}
            </strong>

          </div>

        </section>

        {/* Latest Reward */}
        <section className="painter-dashboard-card painter-latest-card">

          <h2>Latest Reward Earned</h2>

          {latestReward ? (
            <>
              <div className="painter-latest-points">

                {latestReward.rewardType === "POINTS"
                  ? `+${latestReward.points || 0} Points`
                  : `₹${Number(
                      latestReward.cashAmount || 0
                    ).toLocaleString()}`}

              </div>

              <p className="painter-latest-description">
                {latestReward.description || "-"}
              </p>

              <button
                type="button"
                className="painter-view-reward-btn"
              >
                View Reward
              </button>
            </>
          ) : (
            <div className="painter-empty-state">
              No reward data available
            </div>
          )}

        </section>

      </div>

      {/* Bottom Section */}
      <div className="painter-dashboard-bottom">

        {/* Monthly Reward Summary */}
        <section className="painter-dashboard-card painter-monthly-card">

          <h2>Monthly Reward Summary</h2>

          {monthlyRewardSummary?.length > 0 ? (
            <div className="painter-chart">

              {monthlyRewardSummary.map((item) => (
                <div
                  className="painter-chart-column"
                  key={item.month}
                >

                  <div className="painter-chart-bar-wrapper">

                    <div
                      className={`painter-chart-bar ${
                        item.current ? "current" : ""
                      }`}
                      style={{
                        height: `${item.percentage || 0}%`,
                      }}
                    />

                  </div>

                  <span>{item.month}</span>

                </div>
              ))}

            </div>
          ) : (
            <div className="painter-empty-state">
              No monthly reward data available
            </div>
          )}

        </section>

        {/* Active Schemes */}
        <section className="painter-dashboard-card painter-schemes-card">

          <h2>Active Schemes</h2>

          {activeSchemes?.length > 0 ? (
            <div className="painter-scheme-list">

              {activeSchemes.map((scheme) => (
                <div
                  className="painter-scheme-item"
                  key={scheme._id || scheme.name}
                >

                  <div className="painter-scheme-header">

                    <strong>
                      {scheme.name || "-"}
                    </strong>

                    <span>
                      {scheme.progress || 0}%
                    </span>

                  </div>

                  <div className="painter-progress-track">

                    <div
                      className="painter-progress-bar"
                      style={{
                        width: `${scheme.progress || 0}%`,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="painter-empty-state">
              No active schemes available
            </div>
          )}

        </section>

      </div>

    </div>
  );
};

export default PainterDashboard;