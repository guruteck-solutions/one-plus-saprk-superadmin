import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/dealer/DealerNotifications.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const dealerNotifications = (
          response.data.notifications || []
        ).filter(
          (notification) =>
            notification.userType === "DEALERS" ||
            notification.userType === "ALL_USERS"
        );

        setNotifications(dealerNotifications);
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="dealer-notifications">

      {/* ================= HEADER ================= */}

      <div className="notification-page-header">
        <div>
          <h1>Notifications</h1>
          <p>View your latest notifications and updates</p>
        </div>

        <button
          className="notification-refresh-btn"
          onClick={fetchNotifications}
        >
          Refresh
        </button>
      </div>

      {/* ================= NOTIFICATION LIST ================= */}

      <div className="notification-list-card">

        <div className="notification-list-header">
          <div>
            <h2>Notification List</h2>
            <p>Your latest notifications</p>
          </div>

          <span className="notification-count">
            {notifications.length} Notifications
          </span>
        </div>

        {loading ? (
          <div className="notification-empty">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            No notifications found
          </div>
        ) : (
          <div className="notification-table-wrapper">
            <table className="notification-table">

              <thead>
                <tr>
                  <th>Title</th>
                  <th>Channel</th>
                  <th>Message</th>
                  <th>Sent On</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification._id}>

                    <td>
                      <div className="notification-title">
                        {notification.title || "-"}
                      </div>
                    </td>

                    <td>
                      {notification.channel || "-"}
                    </td>

                    <td>
                      <div className="notification-message-preview">
                        {notification.message || "-"}
                      </div>
                    </td>

                    <td>
                      {formatDate(notification.sentOn)}
                    </td>

                    <td>
                      <button
                        className="notification-view-btn"
                        onClick={() =>
                          setSelectedNotification(notification)
                        }
                      >
                        View Details
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

      {/* ================= DETAILS MODAL ================= */}

      {selectedNotification && (
        <div className="notification-modal-overlay">

          <div className="notification-modal">

            <div className="notification-modal-header">

              <div>
                <h2>Notification Details</h2>
                <p>Notification information</p>
              </div>

              <button
                className="notification-modal-close"
                onClick={() =>
                  setSelectedNotification(null)
                }
              >
                ×
              </button>

            </div>

            {/* ================= BASIC DETAILS ================= */}

            <div className="notification-details-grid">

              <div className="notification-detail-item">
                <span>Title</span>
                <strong>
                  {selectedNotification.title || "-"}
                </strong>
              </div>

              <div className="notification-detail-item">
                <span>Channel</span>
                <strong>
                  {selectedNotification.channel || "-"}
                </strong>
              </div>

              <div className="notification-detail-item">
                <span>Sent On</span>
                <strong>
                  {formatDate(selectedNotification.sentOn)}
                </strong>
              </div>

              <div className="notification-detail-item">
                <span>Attachment Type</span>
                <strong>
                  {selectedNotification.attachmentType || "-"}
                </strong>
              </div>

            </div>

            {/* ================= MESSAGE ================= */}

            <div className="notification-detail-full">

              <div className="notification-full-item">
                <span>Message</span>

                <p>
                  {selectedNotification.message || "-"}
                </p>
              </div>

              {/* ================= LINK ================= */}

              {selectedNotification.link && (
                <div className="notification-full-item">
                  <span>External Link</span>

                  <a
                    href={selectedNotification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedNotification.link}
                  </a>
                </div>
              )}

              {/* ================= ATTACHMENT ================= */}

              {selectedNotification.attachment && (
                <div className="notification-full-item">
                  <span>Attachment</span>

                  <a
                    href={selectedNotification.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Attachment
                  </a>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DealerNotifications;