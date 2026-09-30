import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "../../css/painter/PainterRewardTransactionHistory.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterRewardTransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/reward-transaction-history`,
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
            "Failed to fetch reward transaction history"
        );
      }

      setHistory(
        Array.isArray(data.history) ? data.history : []
      );
    } catch (err) {
      console.error(
        "Reward transaction history error:",
        err
      );

      toast.error(
        err.message ||
          "Failed to load reward transaction history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const getStatusClass = (status) => {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      return "-";
    }

    return amount > 0 ? `+${amount}` : amount;
  };

  if (loading) {
    return (
      <div className="painter-reward-history-page">
        <div className="painter-reward-history-loading">
          Loading reward transaction history...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-reward-history-page">
      {/* Header */}
      <div className="painter-reward-history-header">
        <div>
          <h1>Reward Transaction History</h1>
          <p>
            Track your reward transactions and their status
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="painter-reward-history-card">
        {history.length === 0 ? (
          <div className="painter-reward-history-empty">
            <h3>No transactions found</h3>
            <p>
              Your reward transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="painter-reward-history-table-wrapper">
            <table className="painter-reward-history-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Date</th>
                  <th>Reward Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="painter-reward-history-reference">
                        {item.transaction || "-"}
                      </span>
                    </td>

                    <td>
                      {formatDate(item.date)}
                    </td>

                    <td>
                      {item.rewardType || "-"}
                    </td>

                    <td>
                      <span
                        className={
                          item.amount < 0
                            ? "painter-reward-history-negative"
                            : "painter-reward-history-positive"
                        }
                      >
                        {formatAmount(item.amount)}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`painter-reward-history-status ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PainterRewardTransactionHistory;