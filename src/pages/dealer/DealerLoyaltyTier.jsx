import React, { useEffect, useState } from "react";
import { Award, Crown, Star, TrendingUp, Gift, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";
import "../../css/dealer/DealerLoyaltyTier.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerLoyaltyTier = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLoyaltyTier = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/dealer/loyalty-tier`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch loyalty tier"
        );
      }

      setData(result.data);
    } catch (err) {
      setError(err.message || "Failed to load loyalty tier");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoyaltyTier();
  }, []);

  const getTierIcon = (level) => {
    if (Number(level) === 1) return <Award size={32} />;
    if (Number(level) === 2) return <Star size={32} />;
    return <Crown size={32} />;
  };

  if (loading) {
    return (
      <div className="dealer-loyalty-page">
        <div className="dealer-loyalty-loading">
          <RefreshCw size={28} className="dealer-loyalty-loading-icon" />
          <p>Loading loyalty tier...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dealer-loyalty-page">
        <div className="dealer-loyalty-error">
          <p>{error}</p>
          <button onClick={fetchLoyaltyTier}>Try Again</button>
        </div>
      </div>
    );
  }

  const currentTier = data?.currentTier;
  const nextTier = data?.nextTier;
  const currentPurchase = Number(data?.currentPurchase || 0);
  const progressPercentage = Number(data?.progressPercentage || 0);
  const achievementPercentage = Number(
    data?.achievementPercentage || 0
  );

  const benefits = [
    {
      key: "higherRewardPoints",
      title: "Higher Reward Points",
      description: "Earn more points on eligible purchases",
      icon: TrendingUp,
    },
    {
      key: "exclusiveSchemes",
      title: "Exclusive Schemes",
      description: "Access to member-only schemes",
      icon: Gift,
    },
    {
      key: "cashbackOffers",
      title: "Cashback Offers",
      description: "Get cashback on eligible purchases",
      icon: Star,
    },
    {
      key: "earlyProductLaunchAccess",
      title: "Early Product Launch Access",
      description: "Access new products early",
      icon: Crown,
    },
    {
      key: "premiumSupport",
      title: "Premium Support",
      description: "Priority support and faster resolution",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="dealer-loyalty-page">
      <div className="dealer-loyalty-header">
        <div>
          <h1>Loyalty Tier</h1>
          <p>Track your loyalty tier, progress and benefits.</p>
        </div>

        <button
          className="dealer-loyalty-refresh-btn"
          onClick={fetchLoyaltyTier}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="dealer-loyalty-grid">
        <div className="dealer-current-tier-card">
          <div className="dealer-tier-icon">
            {getTierIcon(currentTier?.level)}
          </div>

          <div className="dealer-tier-content">
            <span>Current Tier</span>
            <h2>{currentTier?.tierName || "—"}</h2>
            <p>
              Level {currentTier?.level || "—"} ·{" "}
              {currentTier?.tierType || "STANDARD"}
            </p>
          </div>
        </div>

        <div className="dealer-loyalty-stat-card">
          <span>Current Purchase</span>
          <strong>
            ₹{currentPurchase.toLocaleString("en-IN")}
          </strong>
          <small>Total eligible order value</small>
        </div>

        <div className="dealer-loyalty-stat-card">
          <span>Achievement</span>
          <strong>{achievementPercentage}%</strong>
          <small>Current tier achievement</small>
        </div>
      </div>

      <div className="dealer-loyalty-progress-card">
        <div className="dealer-section-header">
          <div>
            <h2>Tier Progress</h2>
            <p>
              {nextTier
                ? "Progress towards your next loyalty tier."
                : "You are currently at the highest available tier."}
            </p>
          </div>

          <strong>{progressPercentage}%</strong>
        </div>

        <div className="dealer-progress-track">
          <div
            className="dealer-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="dealer-progress-details">
          <div>
            <span>Current Tier</span>
            <strong>{currentTier?.tierName || "—"}</strong>
          </div>

          <ArrowRight size={20} />

          <div>
            <span>Next Tier</span>
            <strong>{nextTier?.tierName || "Highest Tier"}</strong>
          </div>
        </div>

        {nextTier && (
          <div className="dealer-next-tier-target">
            <span>Next Tier Target</span>
            <strong>
              ₹{Number(nextTier.minPurchase || 0).toLocaleString("en-IN")}
            </strong>
          </div>
        )}
      </div>

      <div className="dealer-tier-benefits-card">
        <div className="dealer-section-header">
          <div>
            <h2>Tier Benefits</h2>
            <p>Benefits available with your current tier.</p>
          </div>
        </div>

        <div className="dealer-benefits-grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            const enabled =
              currentTier?.benefits?.[benefit.key] === true;

            return (
              <div
                className={`dealer-benefit-item ${
                  enabled ? "enabled" : "disabled"
                }`}
                key={benefit.key}
              >
                <div className="dealer-benefit-icon">
                  <Icon size={20} />
                </div>

                <div className="dealer-benefit-content">
                  <strong>{benefit.title}</strong>
                  <span>{benefit.description}</span>
                </div>

                <div className="dealer-benefit-status">
                  {enabled ? "Available" : "Not Available"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="dealer-benefit-extra">
          <div>
            <span>Reward Points Multiplier</span>
            <strong>
              {currentTier?.rewardPointsMultiplier || 1}x
            </strong>
          </div>

          <div>
            <span>Cashback</span>
            <strong>
              {currentTier?.cashbackPercentage || 0}%
            </strong>
          </div>

          <div>
            <span>Birthday Special Points</span>
            <strong>
              {currentTier?.benefits?.birthdaySpecialPoints || 0} Pts
            </strong>
          </div>

          <div>
            <span>Anniversary Bonus</span>
            <strong>
              {currentTier?.benefits?.anniversaryBonus || 0} Pts
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerLoyaltyTier;