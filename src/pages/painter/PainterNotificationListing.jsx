import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/painter/PainterNotificationListing.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterNotificationListing = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/notifications`,
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
        throw new Error(data.message || "Failed to fetch notifications");
      }

      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Fetch painter notifications error:", error);
      setError(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIconClass = (channel) => {
    if (channel === "PUSH") {
      return "painter-notification-icon push";
    }

    if (channel === "EMAIL") {
      return "painter-notification-icon email";
    }

    if (channel === "SMS") {
      return "painter-notification-icon sms";
    }

    return "painter-notification-icon";
  };

  const filteredNotifications =
    activeTab === "ALL"
      ? notifications
      : notifications.filter((notification) => {
          const text = `${notification.title || ""} ${
            notification.message || ""
          }`.toLowerCase();

          if (activeTab === "REWARDS") {
            return (
              text.includes("reward") ||
              text.includes("point") ||
              text.includes("redemption")
            );
          }

          if (activeTab === "SCHEMES") {
            return text.includes("scheme") || text.includes("offer");
          }

          return true;
        });

  const handleNotificationClick = (id) => {
    navigate(`/painter/notification-details/${id}`);
  };

  return (
    <div className="painter-notification-listing-page">
      <div className="painter-notification-page-header">
        <h1>Notification Listing</h1>

        <p>
          Oneplus Spark PAINTS <span>•</span> Painter experience
        </p>
      </div>

      <div className="painter-notification-card">
        <div className="painter-notification-card-header">
          <h2>All Notifications</h2>

          <div className="painter-notification-tabs">
            <button
              type="button"
              className={
                activeTab === "ALL"
                  ? "painter-notification-tab active"
                  : "painter-notification-tab"
              }
              onClick={() => setActiveTab("ALL")}
            >
              All {notifications.length}
            </button>

            <button
              type="button"
              className={
                activeTab === "REWARDS"
                  ? "painter-notification-tab active"
                  : "painter-notification-tab"
              }
              onClick={() => setActiveTab("REWARDS")}
            >
              Rewards
            </button>

            <button
              type="button"
              className={
                activeTab === "SCHEMES"
                  ? "painter-notification-tab active"
                  : "painter-notification-tab"
              }
              onClick={() => setActiveTab("SCHEMES")}
            >
              Schemes
            </button>
          </div>
        </div>

        {loading ? (
          <div className="painter-notification-state">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="painter-notification-state error">
            {error}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="painter-notification-state">
            No notifications available.
          </div>
        ) : (
          <div className="painter-notification-list">
            {filteredNotifications.map((notification) => (
              <button
                type="button"
                className="painter-notification-row"
                key={notification._id}
                onClick={() => handleNotificationClick(notification._id)}
              >
                <div
                  className={getNotificationIconClass(
                    notification.channel
                  )}
                >
                  <Bell size={18} />
                </div>

                <div className="painter-notification-content">
                  <h3>{notification.title}</h3>

                  <p>{notification.message}</p>
                </div>

                <span className="painter-notification-category">
                  {notification.channel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PainterNotificationListing;