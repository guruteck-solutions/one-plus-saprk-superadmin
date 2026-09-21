import React, { useEffect, useState } from "react";
import "../../css/painter/PainterRewardAnalytics.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterRewardAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    monthlyRewards: [],
    monthlyScans: [],
    averageRewardPerScan: 0,
    redemptionRate: 0,
    bestMonth: {
      month: "-",
      year: null,
      rewardsEarned: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRewardAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/reward-analytics`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch reward analytics"
        );
      }

      setAnalytics(
        data.analytics || {
          monthlyRewards: [],
          monthlyScans: [],
          averageRewardPerScan: 0,
          redemptionRate: 0,
          bestMonth: {
            month: "-",
            year: null,
            rewardsEarned: 0,
          },
        }
      );
    } catch (err) {
      console.error("Reward analytics error:", err);

      setError(
        err.message || "Failed to load reward analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardAnalytics();
  }, []);

  const getMaxValue = (data, key) => {
    if (!data || data.length === 0) {
      return 0;
    }

    return Math.max(
      ...data.map((item) => Number(item[key] || 0))
    );
  };

  const getBarHeight = (value, maxValue) => {
    if (!value || !maxValue) {
      return 0;
    }

    return Math.max((value / maxValue) * 100, 8);
  };

  if (loading) {
    return (
      <div className="painter-reward-analytics-page">
        <div className="painter-reward-analytics-loading">
          Loading reward analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="painter-reward-analytics-page">
        <div className="painter-reward-analytics-error">
          {error}
        </div>
      </div>
    );
  }

  const rewardsMax = getMaxValue(
    analytics.monthlyRewards,
    "rewardsEarned"
  );

  const scansMax = getMaxValue(
    analytics.monthlyScans,
    "scans"
  );

  return (
    <div className="painter-reward-analytics-page">
      {/* Header */}
      <div className="painter-reward-analytics-header">
        <div>
          <h1>Reward Analytics</h1>
          <p>
            Track your reward performance and activity
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="painter-reward-analytics-charts">
        {/* Monthly Rewards */}
        <div className="painter-reward-analytics-chart-card rewards-chart">
          <h2>Monthly Rewards Earned</h2>

          <div className="painter-reward-analytics-chart">
            <div className="painter-reward-analytics-bars">
              {analytics.monthlyRewards.map((item) => {
                const isLast =
                  item ===
                  analytics.monthlyRewards[
                    analytics.monthlyRewards.length - 1
                  ];

                return (
                  <div
                    className="painter-reward-analytics-bar-item"
                    key={`${item.month}-${item.year}`}
                  >
                    <div className="painter-reward-analytics-bar-area">
                      <div
                        className={`painter-reward-analytics-bar ${
                          isLast ? "active" : ""
                        }`}
                        style={{
                          height: `${getBarHeight(
                            item.rewardsEarned,
                            rewardsMax
                          )}%`,
                        }}
                        title={`${item.rewardsEarned} points`}
                      />
                    </div>

                    <span>{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Scans */}
        <div className="painter-reward-analytics-chart-card scans-chart">
          <h2>Monthly Scans</h2>

          <div className="painter-reward-analytics-chart">
            <div className="painter-reward-analytics-bars">
              {analytics.monthlyScans.map((item) => {
                const isLast =
                  item ===
                  analytics.monthlyScans[
                    analytics.monthlyScans.length - 1
                  ];

                return (
                  <div
                    className="painter-reward-analytics-bar-item"
                    key={`${item.month}-${item.year}`}
                  >
                    <div className="painter-reward-analytics-bar-area">
                      <div
                        className={`painter-reward-analytics-bar ${
                          isLast ? "active" : ""
                        }`}
                        style={{
                          height: `${getBarHeight(
                            item.scans,
                            scansMax
                          )}%`,
                        }}
                        title={`${item.scans} scans`}
                      />
                    </div>

                    <span>
                      {item.month.charAt(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="painter-reward-analytics-summary">
        {/* Average Reward */}
        <div className="painter-reward-analytics-summary-card">
          <div className="painter-reward-analytics-summary-icon reward-icon">
            *
          </div>

          <div>
            <span>Avg. Reward / Scan</span>

            <strong>
              {analytics.averageRewardPerScan} pts
            </strong>

            <small>Last 30 days</small>
          </div>
        </div>

        {/* Redemption Rate */}
        <div className="painter-reward-analytics-summary-card">
          <div className="painter-reward-analytics-summary-icon redemption-icon">
            %
          </div>

          <div>
            <span>Redemption Rate</span>

            <strong>
              {analytics.redemptionRate}%
            </strong>

            <small>
              {analytics.redemptionRate > 0
                ? "Based on earned rewards"
                : "No redemption data"}
            </small>
          </div>
        </div>

        {/* Best Month */}
        <div className="painter-reward-analytics-summary-card">
          <div className="painter-reward-analytics-summary-icon month-icon">
            ■
          </div>

          <div>
            <span>Best Month</span>

            <strong>
              {analytics.bestMonth?.month || "-"}
            </strong>

            <small>
              {analytics.bestMonth?.rewardsEarned || 0}{" "}
              points earned
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainterRewardAnalytics;