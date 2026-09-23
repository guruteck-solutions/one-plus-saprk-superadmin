import React, { useEffect, useState } from "react";
import "../../css/painter/PainterReferralStatus.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterReferralStatus = () => {
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReferralStatus();
  }, []);

  const fetchReferralStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/referrals/history`,
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
        throw new Error(
          data.message || "Failed to fetch referral status"
        );
      }

      const referrals = data.referrals || [];

      if (referrals.length > 0) {
        setReferral(referrals[0]);
      } else {
        setReferral(null);
      }
    } catch (error) {
      console.error("Fetch referral status error:", error);
      setError(error.message || "Failed to load referral status");
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = [
    {
      key: "referralShared",
      label: "Referral shared",
    },
    {
      key: "registrationCompleted",
      label: "Registration completed",
    },
    {
      key: "verificationApproved",
      label: "Verification approved",
    },
    {
      key: "eligibleActivity",
      label: "Eligible activity",
    },
    {
      key: "rewardCredited",
      label: "Reward credited",
    },
  ];

  const getCategoryName = (category) => {
    if (!category) return "Painter";

    return category
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getCurrentStep = () => {
    if (!referral) return -1;

    let currentStep = -1;

    statusSteps.forEach((step, index) => {
      if (referral[step.key]) {
        currentStep = index;
      }
    });

    return currentStep;
  };

  const currentStep = getCurrentStep();

  if (loading) {
    return (
      <div className="painter-referral-status-page">
        <div className="painter-referral-status-state">
          Loading referral status...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="painter-referral-status-page">
        <div className="painter-referral-status-state error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="painter-referral-status-page">
      <div className="painter-referral-status-header">
        <div>
          <h1>Referral Status</h1>

          <p>
            Oneplus Spark PAINTS <span>•</span> Painter experience
          </p>
        </div>
      </div>

      {!referral ? (
        <div className="painter-referral-status-card">
          <div className="painter-referral-status-empty">
            No referral found.
          </div>
        </div>
      ) : (
        <div className="painter-referral-status-card">
          <h2>Referral Status</h2>

          <div className="painter-referral-person">
            <strong>{referral.referredName || "-"}</strong>
            <span>•</span>
            <span>{getCategoryName(referral.category)}</span>
          </div>

          <div className="painter-referral-status-content">
            <div className="painter-referral-timeline">
              {statusSteps.map((step, index) => {
                const isCompleted = Boolean(referral[step.key]);
                const isLast = index === statusSteps.length - 1;

                return (
                  <div
                    className={`painter-referral-step ${
                      isCompleted ? "completed" : "pending"
                    }`}
                    key={step.key}
                  >
                    <div className="painter-referral-step-left">
                      <div className="painter-referral-step-dot">
                        {isCompleted && <span />}
                      </div>

                      {!isLast && (
                        <div className="painter-referral-step-line" />
                      )}
                    </div>

                    <div className="painter-referral-step-label">
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="painter-referral-reward-box">
              <span>
                {referral.rewardCredited
                  ? "Reward credited"
                  : "Pending Reward"}
              </span>

              <strong>
                ₹{Number(referral.reward || 0).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainterReferralStatus;