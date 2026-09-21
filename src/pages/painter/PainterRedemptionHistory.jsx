import React, { useEffect, useState } from "react";
import "../../css/painter/PainterRedemptionHistory.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const PainterRedemptionHistory = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRedemptionHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/painter/redemption-history`,
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
            "Failed to fetch redemption history"
        );
      }

      setRedemptions(data.redemptions || []);
    } catch (err) {
      console.error(
        "Redemption History Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load redemption history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptionHistory();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  const formatAmount = (amount, type) => {
    const value = Number(amount || 0);

    if (type === "Cash") {
      return `₹${value.toLocaleString("en-IN")}`;
    }

    return `${value.toLocaleString("en-IN")} points`;
  };

  const getStatusClass = (status) => {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  return (
    <div className="painter-redemption-history-page">
      <div className="painter-redemption-history-container">

        {/* HEADER */}
        <div className="painter-redemption-history-header">
          <h1>Redemption History</h1>

          <p>
            Oneplus Spark PAINTS • Painter experience
          </p>
        </div>

        {/* TABLE CARD */}
        <div className="painter-redemption-history-card">

          {loading ? (
            <div className="painter-redemption-history-loading">
              Loading redemption history...
            </div>
          ) : error ? (
            <div className="painter-redemption-history-error">
              {error}

              <button
                type="button"
                onClick={fetchRedemptionHistory}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="painter-redemption-history-table-wrapper">

              <table className="painter-redemption-history-table">

                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {redemptions.length > 0 ? (
                    redemptions.map((redemption) => (
                      <tr key={redemption._id}>
                        <td>
                          {redemption.requestId || "-"}
                        </td>

                        <td>
                          {formatDate(
                            redemption.date
                          )}
                        </td>

                        <td>
                          {redemption.type || "-"}
                        </td>

                        <td>
                          {formatAmount(
                            redemption.amount,
                            redemption.type
                          )}
                        </td>

                        <td>
                          <span
                            className={`painter-redemption-history-status painter-redemption-history-status-${getStatusClass(
                              redemption.status
                            )}`}
                          >
                            {redemption.status || "-"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="painter-redemption-history-empty"
                      >
                        No redemption history found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default PainterRedemptionHistory;