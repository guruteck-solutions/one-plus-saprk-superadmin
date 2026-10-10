import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/dealer/DealerRedemptionDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const statuses = [
  "Pending",
  "Under Verification",
  "Approved",
  "Processed",
  "Completed",
];

const DealerRedemptionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [redemption, setRedemption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRedemptionDetails();
  }, [id]);

  const fetchRedemptionDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/dealer/reward-redemptions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setRedemption(data.redemption);
      }
    } catch (error) {
      console.error("Redemption details error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = () => {
    if (!redemption) return -1;

    return statuses.indexOf(redemption.status);
  };

  if (loading) {
    return (
      <div className="dealer-redemption-details-page">
        <div className="dealer-redemption-details-loading">
          Loading redemption details...
        </div>
      </div>
    );
  }

  if (!redemption) {
    return (
      <div className="dealer-redemption-details-page">
        <div className="dealer-redemption-details-empty">
          Redemption details not found.
        </div>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex();
  const isRejected = redemption.status === "Rejected";

  return (
    <div className="dealer-redemption-details-page">
      <div className="dealer-redemption-details-header">
        <button
          type="button"
          className="dealer-redemption-details-back-btn"
          onClick={() => navigate("/dealer/reward-redemption-history")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1>Redemption Details</h1>
          <p>View complete details of your redemption request</p>
        </div>
      </div>

      <div className="dealer-redemption-details-container">
        <div className="dealer-redemption-details-title">
          <div>
            <h2>Redemption Request</h2>
            <span>{redemption.redemptionId}</span>
          </div>

          <span
            className={`dealer-redemption-details-status dealer-redemption-details-status-${redemption.status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {redemption.status}
          </span>
        </div>

        <div className="dealer-redemption-details-info-grid">
          <div>
            <span>Redemption ID</span>
            <strong>{redemption.redemptionId}</strong>
          </div>

          <div>
            <span>Request Date</span>
            <strong>
              {new Date(redemption.createdAt).toLocaleDateString()}
            </strong>
          </div>

          <div>
            <span>Request Time</span>
            <strong>
              {new Date(redemption.createdAt).toLocaleTimeString()}
            </strong>
          </div>

          <div>
            <span>Reward Type</span>
            <strong>{redemption.rewardType}</strong>
          </div>

          <div>
            <span>Redeemed Points</span>
            <strong>
              {redemption.rewardType === "POINTS"
                ? `${redemption.points} Points`
                : "-"}
            </strong>
          </div>

          <div>
            <span>Redeemed Cash</span>
            <strong>
              {redemption.rewardType === "CASH"
                ? `₹${redemption.cashAmount}`
                : "-"}
            </strong>
          </div>

          <div>
            <span>Last Updated</span>
            <strong>
              {new Date(redemption.updatedAt).toLocaleString()}
            </strong>
          </div>

          <div>
            <span>Description</span>
            <strong>{redemption.description || "-"}</strong>
          </div>
        </div>

        <div className="dealer-redemption-details-timeline-section">
          <h2>Redemption Status</h2>

          {isRejected ? (
            <div className="dealer-redemption-details-rejected">
              <XCircle size={22} />
              <div>
                <strong>Request Rejected</strong>
                <p>
                  {redemption.rejectionReason || "No rejection reason provided."}
                </p>
              </div>
            </div>
          ) : (
            <div className="dealer-redemption-details-timeline">
              {statuses.map((status, index) => {
                const completed = index <= currentStatusIndex;
                const current = index === currentStatusIndex;

                return (
                  <div
                    className={`dealer-redemption-details-timeline-item ${
                      completed ? "completed" : ""
                    } ${current ? "current" : ""}`}
                    key={status}
                  >
                    <div className="dealer-redemption-details-timeline-icon">
                      {completed ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Clock size={20} />
                      )}
                    </div>

                    <div className="dealer-redemption-details-timeline-content">
                      <strong>{status}</strong>

                      {current && (
                        <span>Current Status</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerRedemptionDetails;