import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../css/painter/PainterRedemptionRequest.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const PainterRedemptionRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [rewardType, setRewardType] = useState(
    location.state?.rewardType || "POINTS"
  );

  const [requestedAmount, setRequestedAmount] = useState(
    location.state?.requestedAmount || ""
  );

  const [payoutAccount, setPayoutAccount] = useState(
    location.state?.payoutAccount || ""
  );

  const [remarks, setRemarks] = useState(
    location.state?.remarks || "Reward redemption"
  );

  const [loading, setLoading] = useState(false);

  const handleSubmitRequest = async () => {
    if (
      !requestedAmount ||
      Number(requestedAmount) <= 0
    ) {
      toast.error("Valid requested amount is required.");
      return;
    }

    if (!payoutAccount.trim()) {
      toast.error("Payout account is required.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/painter/redeem-rewards/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rewardType,
            requestedAmount: Number(requestedAmount),
            payoutAccount: payoutAccount.trim(),
            remarks: remarks.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create redemption request"
        );
      }

      toast.success(
        "Redemption request submitted successfully."
      );

      setTimeout(() => {
        navigate("/painter/redemption-status", {
          state: {
            requestId:
              data.redemptionRequest?.requestId,
          },
        });
      }, 800);
    } catch (err) {
      console.error(
        "Redemption Request Error:",
        err
      );

      toast.error(
        err.message ||
          "Failed to submit redemption request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="painter-redemption-request-page">
      <div className="painter-redemption-request-container">

        {/* PAGE HEADER */}
        <div className="painter-redemption-request-header">
          <h1>Redemption Request</h1>

          <p>
            Oneplus Spark PAINTS • Painter experience
          </p>
        </div>

        {/* REQUEST CARD */}
        <div className="painter-redemption-request-card">

          <h2>Redemption Request</h2>

          {/* REWARD TYPE */}
          <div className="painter-redemption-request-field">
            <label htmlFor="rewardType">
              Reward Type
            </label>

            <select
              id="rewardType"
              value={rewardType}
              onChange={(e) =>
                setRewardType(e.target.value)
              }
              className="painter-redemption-request-input"
            >
              <option value="POINTS">Points</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          {/* REQUESTED AMOUNT */}
          <div className="painter-redemption-request-field">
            <label htmlFor="requestedAmount">
              Requested Amount
            </label>

            <div className="painter-redemption-request-amount-wrapper">
              <input
                id="requestedAmount"
                type="number"
                min="0"
                value={requestedAmount}
                onChange={(e) =>
                  setRequestedAmount(e.target.value)
                }
                className="painter-redemption-request-input"
                placeholder={
                  rewardType === "POINTS"
                    ? "Enter points"
                    : "Enter amount"
                }
              />

              <span>
                {rewardType === "POINTS"
                  ? "points"
                  : "₹"}
              </span>
            </div>
          </div>

          {/* PAYOUT ACCOUNT */}
          <div className="painter-redemption-request-field">
            <label htmlFor="payoutAccount">
              Payout Account
            </label>

            <input
              id="payoutAccount"
              type="text"
              value={payoutAccount}
              onChange={(e) =>
                setPayoutAccount(e.target.value)
              }
              className="painter-redemption-request-input"
              placeholder="Enter bank / reward account"
            />
          </div>

          {/* REMARKS */}
          <div className="painter-redemption-request-field">
            <label htmlFor="remarks">
              Remarks
            </label>

            <input
              id="remarks"
              type="text"
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              className="painter-redemption-request-input"
              placeholder="Enter remarks"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="button"
            className="painter-redemption-request-submit"
            onClick={handleSubmitRequest}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Request"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default PainterRedemptionRequest;