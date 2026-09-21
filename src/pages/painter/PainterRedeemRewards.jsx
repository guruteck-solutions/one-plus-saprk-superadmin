import React, { useEffect, useState } from "react";
import { Coins, IndianRupee, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/painter/PainterRedeemRewards.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const PainterRedeemRewards = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [rewardType, setRewardType] = useState(
    location.state?.rewardType || "POINTS"
  );

  const [wallet, setWallet] = useState({
    availablePoints: 0,
    cashRewards: 0,
  });

  const [amount, setAmount] = useState("");
  const [payoutAccount, setPayoutAccount] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/painter/redeem-rewards`,
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
          data.message || "Failed to fetch wallet"
        );
      }

      setWallet({
        availablePoints:
          data.wallet?.availablePoints || 0,
        cashRewards:
          data.wallet?.cashRewards || 0,
      });
    } catch (err) {
      console.error("Redeem Rewards Error:", err);

      setError(
        err.message || "Failed to load reward balance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const availableAmount =
    rewardType === "POINTS"
      ? wallet.availablePoints
      : wallet.cashRewards;

  const formatAmount = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const handleRewardTypeChange = (type) => {
    setRewardType(type);
    setAmount("");
    setError("");
    setSuccess("");
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;

    if (value === "" || Number(value) >= 0) {
      setAmount(value);
      setError("");
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const requestedAmount = Number(amount);

    if (!amount || requestedAmount <= 0) {
      setError("Please enter a valid redemption amount.");
      return;
    }

    if (requestedAmount > availableAmount) {
      setError(
        rewardType === "POINTS"
          ? "Requested points exceed available points."
          : "Requested cash exceeds available cash rewards."
      );
      return;
    }

    if (!payoutAccount.trim()) {
      setError("Please enter Bank / Reward Account.");
      return;
    }

    try {
      setSubmitting(true);

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
            requestedAmount,
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

      setSuccess(
        "Redemption request created successfully."
      );

      setAmount("");
      setPayoutAccount("");
      setRemarks("");

      setTimeout(() => {
        navigate("/painter/redemption-request");
      }, 800);
    } catch (err) {
      console.error(
        "Create Redemption Request Error:",
        err
      );

      setError(
        err.message ||
          "Failed to create redemption request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="painter-redeem-page">
        <div className="painter-redeem-loading">
          Loading reward balance...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-redeem-page">
      <div className="painter-redeem-container">

        {/* HEADER */}
        <div className="painter-redeem-header">
          <div>
            <h1>Redeem Rewards</h1>
            <p>
              Redeem your available reward points or
              cash rewards
            </p>
          </div>
        </div>

        {/* REWARD TYPE */}
        <div className="painter-redeem-card">

          <div className="painter-redeem-section-title">
            <h2>Choose Reward Type</h2>
            <p>
              Select the reward you want to redeem
            </p>
          </div>

          <div className="painter-redeem-type-grid">

            <button
              type="button"
              className={`painter-redeem-type-card ${
                rewardType === "POINTS"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleRewardTypeChange("POINTS")
              }
            >
              <div className="painter-redeem-type-icon points">
                <Coins size={22} />
              </div>

              <div>
                <strong>Reward Points</strong>
                <span>
                  {formatAmount(
                    wallet.availablePoints
                  )}{" "}
                  points available
                </span>
              </div>
            </button>

            <button
              type="button"
              className={`painter-redeem-type-card ${
                rewardType === "CASH"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleRewardTypeChange("CASH")
              }
            >
              <div className="painter-redeem-type-icon cash">
                <IndianRupee size={22} />
              </div>

              <div>
                <strong>Cash Rewards</strong>
                <span>
                  ₹
                  {formatAmount(
                    wallet.cashRewards
                  )}{" "}
                  available
                </span>
              </div>
            </button>

          </div>
        </div>

        {/* FORM */}
        <form
          className="painter-redeem-card"
          onSubmit={handleContinue}
        >

          <div className="painter-redeem-section-title">
            <h2>Redemption Details</h2>
            <p>
              Enter the amount and payout account
            </p>
          </div>

          {/* AVAILABLE BALANCE */}
          <div className="painter-redeem-balance">
            <span>Available Balance</span>

            <strong>
              {rewardType === "POINTS"
                ? `${formatAmount(
                    availableAmount
                  )} Points`
                : `₹${formatAmount(
                    availableAmount
                  )}`}
            </strong>
          </div>

          {/* AMOUNT */}
          <div className="painter-redeem-form-group">
            <label htmlFor="redeemAmount">
              Redemption Amount
            </label>

            <div className="painter-redeem-input-wrapper">
              {rewardType === "CASH" && (
                <span>₹</span>
              )}

              <input
                id="redeemAmount"
                type="number"
                min="0"
                max={availableAmount}
                value={amount}
                onChange={handleAmountChange}
                placeholder={
                  rewardType === "POINTS"
                    ? "Enter points"
                    : "Enter amount"
                }
              />

              {rewardType === "POINTS" && (
                <span>Points</span>
              )}
            </div>
          </div>

          {/* PAYOUT ACCOUNT */}
          <div className="painter-redeem-form-group">
            <label htmlFor="payoutAccount">
              Bank / Reward Account
            </label>

            <input
              id="payoutAccount"
              type="text"
              value={payoutAccount}
              onChange={(e) =>
                setPayoutAccount(e.target.value)
              }
              placeholder="Enter bank / reward account"
            />
          </div>

          {/* REMARKS */}
          <div className="painter-redeem-form-group">
            <label htmlFor="remarks">
              Remarks
            </label>

            <textarea
              id="remarks"
              rows="3"
              value={remarks}
              onChange={(e) =>
                setRemarks(e.target.value)
              }
              placeholder="Enter remarks"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="painter-redeem-message error">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="painter-redeem-message success">
              {success}
            </div>
          )}

          {/* CONTINUE */}
          <div className="painter-redeem-form-actions">
            <button
              type="button"
              className="painter-redeem-cancel-btn"
              onClick={() =>
                navigate("/painter/redemption-dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="painter-redeem-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Continue"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default PainterRedeemRewards;