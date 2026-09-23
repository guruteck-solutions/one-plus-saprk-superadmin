import React, { useEffect, useState } from "react";
import {
  Users,
  Clock3,
  Gift,
  TrendingUp,
  UserPlus,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/painter/PainterReferralDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterReferralDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalReferrals: 0,
    pending: 0,
    rewardsEarned: 0,
    successRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const referralCategories = [
    "Painter",
    "Dealer",
    "Contractor",
    "Engineer",
    "Architect",
    "Builder",
    "Interior Designer",
    "Other",
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/referrals/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard");
      }

      setDashboard(data.dashboard || {});
    } catch (error) {
      console.error("Fetch referral dashboard error:", error);
      setError(error.message || "Failed to load referral dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleShareReferral = () => {
    if (selectedCategories.length === 0) return;

    navigate("/painter/share-referral", {
      state: {
        categories: selectedCategories,
      },
    });
  };

  return (
    <div className="painter-referral-dashboard-page">
      <div className="painter-referral-dashboard-header">
        <div>
          <h1>Referral Dashboard</h1>

          <p>
            Oneplus Spark PAINTS <span>•</span> Painter experience
          </p>
        </div>

        <button
          type="button"
          className="painter-referral-history-btn"
          onClick={() => navigate("/painter/referral-history")}
        >
          <Clock3 size={17} />
          Referral History
        </button>
      </div>

      {loading ? (
        <div className="painter-referral-dashboard-state">
          Loading referral dashboard...
        </div>
      ) : error ? (
        <div className="painter-referral-dashboard-state error">
          {error}
        </div>
      ) : (
        <>
          <div className="painter-referral-stats-grid">
            <div className="painter-referral-stat-card">
              <div className="painter-referral-stat-icon blue">
                <Users size={21} />
              </div>

              <div>
                <span>Total Referrals</span>
                <strong>{dashboard.totalReferrals}</strong>

                <small>
                  {dashboard.totalReferrals - dashboard.pending} converted
                </small>
              </div>
            </div>

            <div className="painter-referral-stat-card">
              <div className="painter-referral-stat-icon orange">
                <Clock3 size={21} />
              </div>

              <div>
                <span>Pending</span>
                <strong>{dashboard.pending}</strong>

                <small>Awaiting activation</small>
              </div>
            </div>

            <div className="painter-referral-stat-card">
              <div className="painter-referral-stat-icon green">
                <Gift size={21} />
              </div>

              <div>
                <span>Rewards Earned</span>
                <strong>₹{dashboard.rewardsEarned}</strong>

                <small>Lifetime</small>
              </div>
            </div>

            <div className="painter-referral-stat-card">
              <div className="painter-referral-stat-icon purple">
                <TrendingUp size={21} />
              </div>

              <div>
                <span>Success Rate</span>
                <strong>{dashboard.successRate}%</strong>

                <small>Strong performance</small>
              </div>
            </div>
          </div>

          <div className="painter-refer-new-card">
            <div className="painter-refer-new-content">
              <h2>Refer a new customer</h2>

              <p className="painter-refer-subtitle">
                Choose a referral category
              </p>

              <div className="painter-refer-category-grid">
                {referralCategories.map((item) => {
                  const isSelected = selectedCategories.includes(item);

                  return (
                    <button
                      type="button"
                      key={item}
                      className={`painter-refer-category-btn ${
                        isSelected ? "selected" : ""
                      }`}
                      onClick={() => handleCategoryToggle(item)}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="painter-share-referral-btn"
                onClick={handleShareReferral}
                disabled={selectedCategories.length === 0}
              >
                <Share2 size={15} />
                Share Referral
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PainterReferralDashboard;