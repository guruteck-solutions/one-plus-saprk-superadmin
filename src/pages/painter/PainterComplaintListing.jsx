import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock3, CheckCircle2, List } from "lucide-react";
import { toast } from "sonner";
import "../../css/painter/PainterComplaintListing.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterComplaintListing = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    open: 0,
    underReview: 0,
    resolved: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintData();
  }, []);

  const fetchComplaintData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const [complaintsResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/painter/complaints`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_BASE_URL}/api/painter/complaints/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!complaintsResponse.ok || !statsResponse.ok) {
        throw new Error("Failed to fetch complaint data");
      }

      const complaintsResult = await complaintsResponse.json();

      console.log("COMPLAINT API RESULT:", complaintsResult);
      console.log("COMPLAINT DATA:", complaintsResult.data);
      console.log(
        "COMPLAINT DATA LENGTH:",
        complaintsResult.data?.length
      );

      const statsResult = await statsResponse.json();

      setComplaints(
        complaintsResult.data ||
          complaintsResult.complaints ||
          []
      );

      const statsData = statsResult.data || statsResult.stats || {};

      setStats({
        open: statsData.open || 0,
        underReview: statsData.underReview || 0,
        resolved: statsData.resolved || statsData.closed || 0,
        total: statsData.total || 0,
      });
    } catch (err) {
      console.error("Complaint listing error:", err);
      toast.error("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const handleComplaintClick = (complaint) => {
    navigate("/painter/complaint-details", {
      state: {
        complaintId: complaint._id,
        complaint,
      },
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return "painter-complaint-priority-high";

      case "Medium":
        return "painter-complaint-priority-medium";

      case "Low":
        return "painter-complaint-priority-low";

      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Open":
        return "painter-complaint-status-open";

      case "Under Review":
        return "painter-complaint-status-review";

      case "Closed":
      case "Resolved":
        return "painter-complaint-status-resolved";

      default:
        return "";
    }
  };

  return (
    <div className="painter-complaint-listing-page">
      <div className="painter-complaint-listing-header">
        <div>
          <h1>Complaint Listing</h1>
          <p>View and manage your complaints</p>
        </div>
      </div>

      <div className="painter-complaint-stats-grid">
        <div className="painter-complaint-stat-card">
          <div className="painter-complaint-stat-icon">
            <FileText size={22} />
          </div>

          <div>
            <span>Open</span>
            <strong>{stats.open}</strong>
          </div>
        </div>

        <div className="painter-complaint-stat-card">
          <div className="painter-complaint-stat-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <span>Under Review</span>
            <strong>{stats.underReview}</strong>
          </div>
        </div>

        <div className="painter-complaint-stat-card">
          <div className="painter-complaint-stat-icon">
            <CheckCircle2 size={22} />
          </div>

          <div>
            <span>Resolved</span>
            <strong>{stats.resolved}</strong>
          </div>
        </div>

        <div className="painter-complaint-stat-card">
          <div className="painter-complaint-stat-icon">
            <List size={22} />
          </div>

          <div>
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>
        </div>
      </div>

      <div className="painter-complaint-table-card">
        <div className="painter-complaint-table-header">
          <h2>Complaints</h2>
        </div>

        {loading ? (
          <div className="painter-complaint-state">
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="painter-complaint-state">
            No complaints found.
          </div>
        ) : (
          <div className="painter-complaint-table-wrapper">
            <table className="painter-complaint-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr
                    key={complaint._id}
                    onClick={() => handleComplaintClick(complaint)}
                  >
                    <td>
                      <span className="painter-complaint-id">
                        {complaint.complaintId}
                      </span>
                    </td>

                    <td>{complaint.type || "-"}</td>

                    <td>{formatDate(complaint.submittedAt)}</td>

                    <td>
                      <span
                        className={`painter-complaint-priority ${getPriorityClass(
                          complaint.priority
                        )}`}
                      >
                        {complaint.priority || "-"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`painter-complaint-status ${getStatusClass(
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

export default PainterComplaintListing;