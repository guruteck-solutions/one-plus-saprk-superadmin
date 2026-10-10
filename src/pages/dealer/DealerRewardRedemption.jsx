import React, { useEffect, useState } from "react";
import { ArrowLeft, Coins, Wallet, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/dealer/DealerRewardRedemption.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerRewardRedemption = () => {
  const navigate = useNavigate();

  const [rewardType, setRewardType] = useState("POINTS");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch(
        `${API_BASE_URL}/api/rewards/wallet/${user?._id || user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch wallet");
      }

      setWallet(data.wallet);
    } catch (error) {
      setError(error.message || "Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!amount || Number(amount) <= 0) {
      setError(
        rewardType === "POINTS"
          ? "Please enter valid reward points."
          : "Please enter valid cash amount."
      );
      return;
    }

    const availableAmount =
      rewardType === "POINTS"
        ? Number(wallet?.currentPoints || 0)
        : Number(wallet?.currentCashBalance || 0);

    if (Number(amount) > availableAmount) {
      setError(
        rewardType === "POINTS"
          ? "Insufficient reward points."
          : "Insufficient cash balance."
      );
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/dealer/reward-redemptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rewardType,
            ...(rewardType === "POINTS"
              ? { points: Number(amount) }
              : { cashAmount: Number(amount) }),
            description:
              description.trim() ||
              `Redeem ${rewardType === "POINTS" ? "reward points" : "cash rewards"}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Redemption request failed");
      }

      setMessage("Redemption request submitted successfully.");
      setAmount("");
      setDescription("");

      navigate("/dealer/reward-redemption-history");
    } catch (error) {
      setError(error.message || "Redemption request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dealer-reward-redemption-page">
      <div className="dealer-reward-redemption-header">
        <button
          type="button"
          className="dealer-reward-redemption-back-btn"
          onClick={() => navigate("/dealer/reward-wallet")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1>Reward Redemption</h1>
          <p>Redeem your available reward points or cash rewards</p>
        </div>
      </div>

      {message && (
        <div className="dealer-reward-redemption-success">
          {message}
        </div>
      )}

      {error && (
        <div className="dealer-reward-redemption-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="dealer-reward-redemption-loading">
          Loading wallet...
        </div>
      ) : (
        <>
          <div className="dealer-reward-redemption-balance-grid">
            <div className="dealer-reward-redemption-balance-card">
              <div className="dealer-reward-redemption-icon">
                <Coins size={22} />
              </div>

              <div>
                <span>Available Reward Points</span>
                <strong>{wallet?.currentPoints || 0}</strong>
              </div>
            </div>

            <div className="dealer-reward-redemption-balance-card">
              <div className="dealer-reward-redemption-icon">
                <Wallet size={22} />
              </div>

              <div>
                <span>Available Cash Rewards</span>
                <strong>₹{wallet?.currentCashBalance || 0}</strong>
              </div>
            </div>
          </div>

          <div className="dealer-reward-redemption-container">
            <div className="dealer-reward-redemption-title">
              <h2>Redeem Reward</h2>
              <p>Select reward type and enter the amount you want to redeem.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="dealer-reward-redemption-type">
                <button
                  type="button"
                  className={rewardType === "POINTS" ? "active" : ""}
                  onClick={() => {
                    setRewardType("POINTS");
                    setAmount("");
                    setError("");
                  }}
                >
                  <Coins size={20} />
                  Redeem Points
                </button>

                <button
                  type="button"
                  className={rewardType === "CASH" ? "active" : ""}
                  onClick={() => {
                    setRewardType("CASH");
                    setAmount("");
                    setError("");
                  }}
                >
                  <Wallet size={20} />
                  Redeem Cash
                </button>
              </div>

              <div className="dealer-reward-redemption-form-group">
                <label>
                  {rewardType === "POINTS"
                    ? "Reward Points"
                    : "Cash Amount"}
                </label>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={
                    rewardType === "POINTS"
                      ? "Enter points"
                      : "Enter cash amount"
                  }
                />

                <small>
                  Available:{" "}
                  {rewardType === "POINTS"
                    ? `${wallet?.currentPoints || 0} Points`
                    : `₹${wallet?.currentCashBalance || 0}`}
                </small>
              </div>

              <div className="dealer-reward-redemption-form-group">
                <label>Description</label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter redemption description"
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className="dealer-reward-redemption-submit"
                disabled={submitting}
              >
                <Send size={18} />
                {submitting
                  ? "Submitting..."
                  : "Submit Redemption Request"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default DealerRewardRedemption;