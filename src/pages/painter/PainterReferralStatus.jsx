import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../css/painter/PainterReferralStatus.css";

const PainterReferralStatus = () => {
  const location = useLocation();

  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.referral) {
      setReferral(location.state.referral);
    } else {
      setReferral(null);
    }

    setLoading(false);
  }, [location.state]);

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

    if (Array.isArray(category)) {
      return category
        .map((item) =>
          item
            .toString()
            .toLowerCase()
            .split("_")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join(" ")
        )
        .join(", ");
    }

    return category
      .toString()
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  if (loading) {
    return (
      <div className="painter-referral-status-page">
        <div className="painter-referral-status-state">
          Loading referral status...
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
            Please select referral.
          </div>
        </div>
      ) : (
        <div className="painter-referral-status-card">
          <h2>Referral Status</h2>

          <div className="painter-referral-person">
            <strong>
              {referral.referredName || "-"}
            </strong>

            <span>•</span>

            <span>
              {getCategoryName(referral.category)}
            </span>
          </div>

          <div className="painter-referral-status-content">
            <div className="painter-referral-timeline">
              {statusSteps.map((step, index) => {
                const isCompleted = Boolean(
                  referral[step.key]
                );

                const isLast =
                  index === statusSteps.length - 1;

                return (
                  <div
                    className={`painter-referral-step ${
                      isCompleted
                        ? "completed"
                        : "pending"
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
                ₹
                {Number(
                  referral.reward || 0
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PainterReferralStatus;