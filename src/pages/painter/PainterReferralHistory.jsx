import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "../../css/painter/PainterReferralHistory.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterReferralHistory = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReferralHistory();
  }, []);

  const fetchReferralHistory = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/referrals/history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch referral history"
        );
      }

      setReferrals(data.referrals || []);
    } catch (error) {
      console.error("Fetch referral history error:", error);

      toast.error(
        error.message || "Failed to load referral history"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1).toLowerCase()
    );
  };

  const handleReferralClick = (referral) => {
    navigate("/painter/referral-status", {
      state: {
        referral,
      },
    });
  };

  return (
    <div className="painter-referral-history-page">
      <div className="painter-referral-history-header">
        <div>
          <h1>Referral History</h1>

          <p>
            Oneplus Spark PAINTS <span>•</span> Painter experience
          </p>
        </div>
      </div>

      <div className="painter-referral-history-table-card">
        {loading ? (
          <div className="painter-referral-history-state">
            Loading referral history...
          </div>
        ) : referrals.length === 0 ? (
          <div className="painter-referral-history-state">
            No referral history found.
          </div>
        ) : (
          <div className="painter-referral-history-table-wrapper">
            <table className="painter-referral-history-table">
              <thead>
                <tr>
                  <th>Referral</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Reward</th>
                </tr>
              </thead>

              <tbody>
                {referrals.map((referral) => (
                  <tr
                    key={referral._id}
                    onClick={() => handleReferralClick(referral)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{referral.referredName || "-"}</td>

                    <td>
                      {Array.isArray(referral.category)
                        ? referral.category
                            .map((item) =>
                              item
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) =>
                                  char.toUpperCase()
                                )
                            )
                            .join(", ")
                        : referral.category || "-"}
                    </td>

                    <td>{formatDate(referral.createdAt)}</td>

                    <td>
                      <span
                        className={`painter-referral-status ${String(
                          referral.status || ""
                        ).toLowerCase()}`}
                      >
                        {formatStatus(referral.status)}
                      </span>
                    </td>

                    <td>
                      ₹
                      {Number(
                        referral.reward || 0
                      ).toLocaleString("en-IN")}
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

export default PainterReferralHistory;