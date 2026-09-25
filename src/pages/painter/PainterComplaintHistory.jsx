import React, { useEffect, useState } from "react";
import "../../css/painter/PainterComplaintHistory.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaintHistory();
  }, []);

  const fetchComplaintHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/complaints/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch complaint history."
        );
      }

      setComplaints(result.data || []);
    } catch (err) {
      console.error("Complaint history error:", err);
      setError(err.message || "Failed to load complaint history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "painter-complaint-history-status-open";

      case "Under Review":
        return "painter-complaint-history-status-review";

      case "Closed":
        return "painter-complaint-history-status-closed";

      default:
        return "";
    }
  };

  return (
    <div className="painter-complaint-history-page">
      <div className="painter-complaint-history-header">
        <div>
          <h1>Complaint History</h1>
          <p>View your complaint submission and resolution history</p>
        </div>
      </div>

      <div className="painter-complaint-history-card">
        {loading ? (
          <div className="painter-complaint-history-state">
            Loading complaint history...
          </div>
        ) : error ? (
          <div className="painter-complaint-history-state painter-complaint-history-error">
            {error}
          </div>
        ) : complaints.length === 0 ? (
          <div className="painter-complaint-history-state">
            No complaint history found.
          </div>
        ) : (
          <div className="painter-complaint-history-table-wrapper">
            <table className="painter-complaint-history-table">
              <thead>
                <tr>
                  <th>Complaint</th>
                  <th>Type</th>
                  <th>Submitted</th>
                  <th>Resolved</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>
                      <span className="painter-complaint-history-id">
                        {complaint.complaintId}
                      </span>
                    </td>

                    <td>{complaint.type || "-"}</td>

                    <td>{formatDate(complaint.submittedAt)}</td>

                    <td>{formatDate(complaint.resolvedAt)}</td>

                    <td>
                      <span
                        className={`painter-complaint-history-status ${getStatusClass(
                          complaint.status
                        )}`}
                      >
                        {complaint.status || "-"}
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

export default PainterComplaintHistory;