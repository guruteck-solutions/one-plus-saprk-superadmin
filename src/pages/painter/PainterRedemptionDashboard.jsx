import React, { useEffect, useState } from "react";
import {
  Coins,
  IndianRupee,
  Clock3,
  CheckCircle2,
  ArrowRight,
  Gift,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/painter/PainterRedemptionDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const PainterRedemptionDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    summary: {
      availablePoints: 0,
      cashRewards: 0,
      pending: 0,
      redeemed: 0,
    },
    recentRedemptions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/painter/redemption-dashboard`,
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
          data.message || "Failed to fetch redemption dashboard"
        );
      }

      setDashboardData({
        summary: {
          availablePoints:
            data.summary?.availablePoints || 0,
          cashRewards:
            data.summary?.cashRewards || 0,
          pending: data.summary?.pending || 0,
          redeemed: data.summary?.redeemed || 0,
        },
        recentRedemptions:
          data.recentRedemptions || [],
      });
    } catch (err) {
      console.error(
        "Redemption Dashboard Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load redemption dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const formatAmount = (value, type) => {
    const amount = Number(value || 0);

    if (type === "Cash") {
      return `₹${amount.toLocaleString("en-IN")}`;
    }

    return `${amount.toLocaleString("en-IN")} pts`;
  };

  if (loading) {
    return (
      <div className="painter-redemption-page">
        <div className="painter-redemption-loading">
          Loading redemption dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="painter-redemption-page">
        <div className="painter-redemption-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchDashboard}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const {
    availablePoints,
    cashRewards,
    pending,
    redeemed,
  } = dashboardData.summary;

  return (
    <div className="painter-redemption-page">
      <div className="painter-redemption-container">

        {/* HEADER */}
        <div className="painter-redemption-header">
          <div>
            <h1>Reward Redemption</h1>
            <p>
              Redeem your reward points and cash
              rewards
            </p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="painter-redemption-summary-grid">

          <div className="painter-redemption-summary-card">
            <div className="painter-redemption-card-icon">
              <Coins size={22} />
            </div>

            <div>
              <span>Available Points</span>
              <strong>
                {formatNumber(availablePoints)}
              </strong>
            </div>
          </div>

          <div className="painter-redemption-summary-card">
            <div className="painter-redemption-card-icon">
              <IndianRupee size={22} />
            </div>

            <div>
              <span>Cash Rewards</span>
              <strong>
                ₹{formatNumber(cashRewards)}
              </strong>
            </div>
          </div>

          <div className="painter-redemption-summary-card">
            <div className="painter-redemption-card-icon">
              <Clock3 size={22} />
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {formatNumber(pending)}
              </strong>
            </div>
          </div>

          <div className="painter-redemption-summary-card">
            <div className="painter-redemption-card-icon">
              <CheckCircle2 size={22} />
            </div>

            <div>
              <span>Redeemed</span>
              <strong>
                {formatNumber(redeemed)}
              </strong>
            </div>
          </div>

        </div>

        {/* REDEEM SECTION */}
        <div className="painter-redemption-action-card">
          <div className="painter-redemption-action-header">
            <div>
              <h2>Redeem your rewards</h2>
              <p>
                Choose the reward type you want to
                redeem
              </p>
            </div>

            <Gift size={28} />
          </div>

          <div className="painter-redemption-action-grid">

            <button
              type="button"
              className="painter-redemption-action-btn"
              onClick={() =>
                navigate("/painter/redeem-rewards", {
                  state: {
                    rewardType: "POINTS",
                  },
                })
              }
            >
              <div>
                <strong>Redeem Points</strong>
                <span>
                  Use your available reward points
                </span>
              </div>

              <ArrowRight size={19} />
            </button>

            <button
              type="button"
              className="painter-redemption-action-btn"
              onClick={() =>
                navigate("/painter/redeem-rewards", {
                  state: {
                    rewardType: "CASH",
                  },
                })
              }
            >
              <div>
                <strong>Redeem Cash</strong>
                <span>
                  Redeem your available cash rewards
                </span>
              </div>

              <ArrowRight size={19} />
            </button>

          </div>
        </div>

        {/* RECENT REDEMPTIONS */}
        <div className="painter-redemption-table-card">

          <div className="painter-redemption-section-header">
            <div>
              <h2>Recent Redemption</h2>
              <p>
                Your recent redemption requests
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/painter/redemption-history"
                )
              }
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="painter-redemption-table-wrapper">

            <table className="painter-redemption-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {dashboardData.recentRedemptions
                  .length > 0 ? (
                  dashboardData.recentRedemptions.map(
                    (redemption) => (
                      <tr key={redemption._id}>
                        <td>
                          {redemption.date
                            ? new Date(
                                redemption.date
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "-"}
                        </td>

                        <td>
                          {redemption.type || "-"}
                        </td>

                        <td>
                          {formatAmount(
                            redemption.amount,
                            redemption.type
                          )}
                        </td>

                        <td>
                          <span
                            className={`painter-redemption-status painter-redemption-status-${String(
                              redemption.status ||
                                ""
                            ).toLowerCase()}`}
                          >
                            {redemption.status || "-"}
                          </span>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="painter-redemption-empty"
                    >
                      No redemption requests found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>
        </div>

      </div>
    </div>
  );
};

export default PainterRedemptionDashboard;