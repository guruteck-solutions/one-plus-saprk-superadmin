import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "../../css/painter/PainterNotificationDetails.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterNotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchNotificationDetails();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchNotificationDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/notifications/${id}`,
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
        throw new Error(data.message || "Failed to fetch notification");
      }

      setNotification(data.notification);
    } catch (error) {
      console.error("Fetch notification details error:", error);
      setError(error.message || "Failed to load notification details");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!id) {
    return (
      <div className="painter-notification-details-page">
        <div className="painter-notification-details-header">
          <h1>Notification Details</h1>
          <p>
            Oneplus Spark PAINTS <span>•</span> Painter experience
          </p>
        </div>

        <div className="painter-notification-details-card">
          <p>Please select a notification first.</p>

          <button
            type="button"
            onClick={() => navigate("/painter/notification-listing")}
          >
            Back to Notifications
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="painter-notification-details-page">
        <div className="painter-notification-details-state">
          Loading notification...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="painter-notification-details-page">
        <div className="painter-notification-details-state error">
          {error}
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="painter-notification-details-page">
        <div className="painter-notification-details-state">
          Notification not found.
        </div>
      </div>
    );
  }

  return (
    <div className="painter-notification-details-page">
      <div className="painter-notification-details-header">
        <h1>Notification Details</h1>

        <p>
          Oneplus Spark PAINTS <span>•</span> Painter experience
        </p>
      </div>

      <div className="painter-notification-details-card">
        <div className="painter-notification-details-icon">
          <Bell size={20} />
        </div>

        <h2>{notification.title}</h2>

        <div className="painter-notification-details-date">
          {formatDateTime(notification.sentOn || notification.createdAt)}
        </div>

        <div className="painter-notification-details-message">
          {notification.message}
        </div>

        {notification.targetAudience && (
          <h3>{notification.targetAudience}</h3>
        )}

        <p className="painter-notification-details-description">
          {notification.message}
        </p>

        {notification.link && (
          <button
            type="button"
            className="painter-notification-details-button"
            onClick={() => window.open(notification.link, "_blank")}
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default PainterNotificationDetails;