import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "../../css/painter/PainterRewardLedger.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterRewardLedger = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRewardLedger = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/reward-ledger`,
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
          data.message || "Failed to fetch reward ledger"
        );
      }

      setLedger(
        Array.isArray(data.ledger) ? data.ledger : []
      );
    } catch (err) {
      console.error("Reward ledger error:", err);
      toast.error(
        err.message || "Failed to load reward ledger"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewardLedger();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="painter-reward-ledger-page">
        <div className="painter-reward-ledger-loading">
          Loading reward ledger...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-reward-ledger-page">
      {/* Header */}
      <div className="painter-reward-ledger-header">
        <div>
          <h1>Reward Ledger</h1>
          <p>Track your reward credits, debits and balance</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="painter-reward-ledger-card">
        {ledger.length === 0 ? (
          <div className="painter-reward-ledger-empty">
            <h3>No ledger entries found</h3>
            <p>
              Your reward ledger transactions will appear
              here.
            </p>
          </div>
        ) : (
          <div className="painter-reward-ledger-table-wrapper">
            <table className="painter-reward-ledger-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>
                {ledger.map((entry) => (
                  <tr key={entry._id}>
                    <td>{formatDate(entry.date)}</td>

                    <td>
                      <span className="painter-reward-ledger-reference">
                        {entry.reference || "-"}
                      </span>
                    </td>

                    <td>{entry.type || "-"}</td>

                    <td>
                      {entry.credit > 0 ? (
                        <span className="painter-reward-ledger-credit">
                          +{entry.credit}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      {entry.debit > 0 ? (
                        <span className="painter-reward-ledger-debit">
                          {entry.debit}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td>
                      <strong className="painter-reward-ledger-balance">
                        {entry.balance}
                      </strong>
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

export default PainterRewardLedger;