import React, { useEffect, useState } from "react";
import {
  Award,
  Clock3,
  Coins,
  Gift,
  WalletCards,
} from "lucide-react";

import "../../css/painter/PainterRewardDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterRewardDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    summary: {
      availablePoints: 0,
      cashRewards: 0,
      pendingRewards: 0,
      lifetimeRewards: 0,
    },
    monthlyRewards: [],
    rewardSplit: {
      points: 0,
      cash: 0,
      pending: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH REWARD DASHBOARD
  ===================================================== */

  useEffect(() => {
    const fetchRewardDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/painter/reward-dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch reward dashboard"
          );
        }

        setDashboardData({
          summary: data.summary || {
            availablePoints: 0,
            cashRewards: 0,
            pendingRewards: 0,
            lifetimeRewards: 0,
          },
          monthlyRewards: data.monthlyRewards || [],
          rewardSplit: data.rewardSplit || {
            points: 0,
            cash: 0,
            pending: 0,
          },
        });
      } catch (error) {
        console.error(
          "Reward Dashboard Error:",
          error
        );

        setError(
          error.message ||
            "Failed to load reward dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRewardDashboard();
  }, []);

  const {
    summary,
    monthlyRewards,
    rewardSplit,
  } = dashboardData;

  const maxMonthlyReward = Math.max(
    ...monthlyRewards.map(
      (item) => Number(item.value) || 0
    ),
    1
  );

  const splitTotal =
    Number(rewardSplit.points) +
    Number(rewardSplit.cash) +
    Number(rewardSplit.pending);

  const pointsPercentage =
    splitTotal > 0
      ? (Number(rewardSplit.points) / splitTotal) * 100
      : 0;

  const cashPercentage =
    splitTotal > 0
      ? (Number(rewardSplit.cash) / splitTotal) * 100
      : 0;

  const pendingPercentage =
    splitTotal > 0
      ? (Number(rewardSplit.pending) / splitTotal) * 100
      : 0;

  return (
    <div className="painter-reward-dashboard">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="painter-reward-dashboard-header">
        <div>
          <h1>Reward Dashboard</h1>
          <p>
            Track your rewards and earnings
          </p>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="painter-reward-dashboard-error">
          {error}
        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="painter-reward-summary-grid">

        <div className="painter-reward-summary-card">
          <div className="painter-reward-card-icon">
            <Coins size={22} />
          </div>

          <div className="painter-reward-card-content">
            <span>Available Points</span>

            <strong>
              {loading
                ? "..."
                : summary.availablePoints}
            </strong>
          </div>
        </div>

        <div className="painter-reward-summary-card">
          <div className="painter-reward-card-icon">
            <WalletCards size={22} />
          </div>

          <div className="painter-reward-card-content">
            <span>Cash Rewards</span>

            <strong>
              {loading
                ? "..."
                : `₹${summary.cashRewards}`}
            </strong>
          </div>
        </div>

        <div className="painter-reward-summary-card">
          <div className="painter-reward-card-icon">
            <Clock3 size={22} />
          </div>

          <div className="painter-reward-card-content">
            <span>Pending Rewards</span>

            <strong>
              {loading
                ? "..."
                : summary.pendingRewards}
            </strong>
          </div>
        </div>

        <div className="painter-reward-summary-card">
          <div className="painter-reward-card-icon">
            <Award size={22} />
          </div>

          <div className="painter-reward-card-content">
            <span>Lifetime Rewards</span>

            <strong>
              {loading
                ? "..."
                : summary.lifetimeRewards}
            </strong>
          </div>
        </div>

      </div>

      {/* =================================================
          ANALYTICS SECTION
      ================================================= */}

      <div className="painter-reward-analytics-grid">

        {/* =================================================
            REWARDS COLLECTED
        ================================================= */}

        <div className="painter-reward-panel painter-reward-monthly-panel">

          <div className="painter-reward-panel-header">
            <div>
              <h2>Rewards Collected</h2>
              <p>Monthly reward collection</p>
            </div>

            <Gift size={20} />
          </div>

          <div className="painter-reward-chart">

            {monthlyRewards.length > 0 ? (
              monthlyRewards.map((item) => {
                const value =
                  Number(item.value) || 0;

                const height =
                  value > 0
                    ? Math.max(
                        (value / maxMonthlyReward) *
                          100,
                        8
                      )
                    : 3;

                return (
                  <div
                    className="painter-reward-chart-column"
                    key={item.month}
                  >
                    <div className="painter-reward-chart-value">
                      {value}
                    </div>

                    <div className="painter-reward-chart-bar-wrapper">
                      <div
                        className="painter-reward-chart-bar"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    </div>

                    <span>
                      {item.month}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="painter-reward-empty-state">
                No reward data available
              </div>
            )}

          </div>
        </div>

        {/* =================================================
            REWARD SPLIT
        ================================================= */}

        <div className="painter-reward-panel painter-reward-split-panel">

          <div className="painter-reward-panel-header">
            <div>
              <h2>Reward Split</h2>
              <p>Reward distribution</p>
            </div>

            <Award size={20} />
          </div>

          <div className="painter-reward-split-content">

            <div
              className="painter-reward-donut"
              style={{
                background:
                  splitTotal > 0
                    ? `conic-gradient(
                        #2563eb 0% ${pointsPercentage}%,
                        #16a34a ${pointsPercentage}% ${
                        pointsPercentage +
                        cashPercentage
                      }%,
                        #f59e0b ${
                          pointsPercentage +
                          cashPercentage
                        }% 100%
                      )`
                    : "#e5e7eb",
              }}
            >
              <div className="painter-reward-donut-center">
                <strong>
                  {splitTotal > 0
                    ? Math.round(splitTotal)
                    : 0}
                </strong>
                <span>Total</span>
              </div>
            </div>

            <div className="painter-reward-split-list">

              <div className="painter-reward-split-item">
                <div className="painter-reward-split-label">
                  <span className="painter-reward-dot painter-reward-dot-points" />
                  <span>Points</span>
                </div>

                <strong>
                  {rewardSplit.points || 0}
                </strong>
              </div>

              <div className="painter-reward-split-item">
                <div className="painter-reward-split-label">
                  <span className="painter-reward-dot painter-reward-dot-cash" />
                  <span>Cash</span>
                </div>

                <strong>
                  {rewardSplit.cash || 0}
                </strong>
              </div>

              <div className="painter-reward-split-item">
                <div className="painter-reward-split-label">
                  <span className="painter-reward-dot painter-reward-dot-pending" />
                  <span>Pending</span>
                </div>

                <strong>
                  {rewardSplit.pending || 0}
                </strong>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PainterRewardDashboard;