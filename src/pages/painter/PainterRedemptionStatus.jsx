import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../css/painter/PainterRedemptionStatus.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const PainterRedemptionStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [redemption, setRedemption] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestId = location.state?.requestId;

  const fetchRedemptionStatus = async () => {
    try {
      setLoading(true);

      if (!requestId) {
        toast.error(
          "No redemption request selected. Please submit a redemption request first to view its status."
        );
        return;
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/painter/redemption-status/${requestId}`,
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
          data.message ||
            "Failed to fetch redemption status"
        );
      }

      setRedemption(data.redemption);
    } catch (err) {
      console.error(
        "Redemption Status Error:",
        err
      );

      toast.error(
        err.message ||
          "Failed to load redemption status"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptionStatus();
  }, [requestId]);

  const statusSteps = [
    {
      key: "PENDING",
      label: "Request submitted",
    },
    {
      key: "UNDER_VERIFICATION",
      label: "Under verification",
    },
    {
      key: "APPROVED",
      label: "Approved",
    },
    {
      key: "PROCESSED",
      label: "Processed",
    },
    {
      key: "COMPLETED",
      label: "Completed",
    },
  ];

  const getCurrentStepIndex = () => {
    if (!redemption) {
      return -1;
    }

    if (redemption.status === "REJECTED") {
      return -1;
    }

    return statusSteps.findIndex(
      (step) => step.key === redemption.status
    );
  };

  const currentStepIndex = getCurrentStepIndex();

  const formatAmount = () => {
    if (!redemption) {
      return "-";
    }

    const amount = Number(
      redemption.requestedAmount || 0
    ).toLocaleString("en-IN");

    return redemption.rewardType === "CASH"
      ? `₹${amount}`
      : `${amount} Points`;
  };

  const getStatusTitle = () => {
    if (!redemption) {
      return "Redemption Status";
    }

    switch (redemption.status) {
      case "PENDING":
        return "Redemption Pending";

      case "UNDER_VERIFICATION":
        return "Under Verification";

      case "APPROVED":
        return "Redemption Approved";

      case "PROCESSED":
        return "Redemption Processed";

      case "COMPLETED":
        return "Redemption Completed";

      case "REJECTED":
        return "Redemption Rejected";

      default:
        return "Redemption Status";
    }
  };

  return (
    <div className="painter-redemption-status-page">
      <div className="painter-redemption-status-container">

        <div className="painter-redemption-status-header">
          <h1>Redemption Status</h1>

          <p>
            Oneplus Spark PAINTS • Painter experience
          </p>
        </div>

        {loading ? (
          <div className="painter-redemption-status-card">
            <div className="painter-redemption-status-loading">
              Loading redemption status...
            </div>
          </div>
        ) : redemption ? (
          <div className="painter-redemption-status-card">

            <div className="painter-redemption-status-icon">
              {redemption.status === "REJECTED" ? (
                "!"
              ) : (
                <Check size={20} strokeWidth={3} />
              )}
            </div>

            <h2>
              {getStatusTitle()}
            </h2>

            <p className="painter-redemption-status-request">
              Request {redemption.requestId}
            </p>

            <div className="painter-redemption-status-amount">
              {formatAmount()}
            </div>

            <div className="painter-redemption-status-timeline">

              {statusSteps.map((step, index) => {
                const isCompleted =
                  currentStepIndex >= index;

                const isCurrent =
                  currentStepIndex === index;

                return (
                  <div
                    className={`painter-redemption-status-step ${
                      isCompleted ? "completed" : ""
                    } ${
                      isCurrent ? "current" : ""
                    }`}
                    key={step.key}
                  >
                    <div className="painter-redemption-status-step-marker">
                      {isCompleted ? (
                        <Check
                          size={12}
                          strokeWidth={3}
                        />
                      ) : null}
                    </div>

                    {index <
                      statusSteps.length - 1 && (
                      <div className="painter-redemption-status-step-line" />
                    )}

                    <span>
                      {step.label}
                    </span>
                  </div>
                );
              })}

            </div>

            <button
              type="button"
              className="painter-redemption-status-history-btn"
              onClick={() =>
                navigate(
                  "/painter/redemption-history"
                )
              }
            >
              View Redemption History
            </button>

          </div>
        ) : null}

      </div>
    </div>
  );
};

export default PainterRedemptionStatus;