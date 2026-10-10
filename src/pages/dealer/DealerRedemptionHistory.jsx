import React, { useEffect, useState } from "react";
import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/dealer/DealerRedemptionHistory.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerRedemptionHistory = () => {
  const navigate = useNavigate();

  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRedemptionHistory();
  }, []);

  const fetchRedemptionHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/dealer/reward-redemptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setRedemptions(data.redemptions || []);
      }
    } catch (error) {
      console.error("Redemption history error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dealer-redemption-history-page">
      <div className="dealer-redemption-history-header">
        <button
          type="button"
          className="dealer-redemption-history-back-btn"
          onClick={() => navigate("/dealer/reward-wallet")}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div>
          <h1>Redemption History</h1>
          <p>View your reward redemption requests and their status</p>
        </div>
      </div>

      <div className="dealer-redemption-history-section">
        <div className="dealer-redemption-history-title">
          <h2>Redemption Requests</h2>
        </div>

        {loading ? (
          <div className="dealer-redemption-history-loading">
            Loading redemption history...
          </div>
        ) : redemptions.length === 0 ? (
          <div className="dealer-redemption-history-empty">
            No redemption requests found.
          </div>
        ) : (
          <div className="dealer-redemption-history-table-wrapper">
            <table className="dealer-redemption-history-table">
              <thead>
                <tr>
                  <th>Redemption ID</th>
                  <th>Date</th>
                  <th>Reward Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {redemptions.map((item) => (
                  <tr key={item._id}>
                    <td>{item.redemptionId}</td>

                    <td>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td>{item.rewardType}</td>

                    <td>
                      {item.rewardType === "POINTS"
                        ? `${item.points} Points`
                        : `₹${item.cashAmount}`}
                    </td>

                    <td>
                      <span
                        className={`dealer-redemption-history-status dealer-redemption-history-status-${item.status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="dealer-redemption-history-view-btn"
                        onClick={() =>
                          navigate(
                            `/dealer/reward-redemption-history/${item._id}`
                          )
                        }
                      >
                        <Eye size={16} />
                        View
                      </button>
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

export default DealerRedemptionHistory;