import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "../../css/painter/PainterNotificationSettings.css";

const PainterNotificationSettings = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const [settings, setSettings] = useState({
    rewardCredited: true,
    newSchemesOffers: true,
    leadUpdates: true,
    orderEnquiryUpdates: true,
    complaintUpdates: true,
    marketingCampaigns: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/notification-settings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch notification settings"
        );
      }

      const data = result.data;

      setSettings({
        rewardCredited: data.rewardCredited ?? true,
        newSchemesOffers: data.newSchemesOffers ?? true,
        leadUpdates: data.leadUpdates ?? true,
        orderEnquiryUpdates: data.orderEnquiryUpdates ?? true,
        complaintUpdates: data.complaintUpdates ?? true,
        marketingCampaigns: data.marketingCampaigns ?? true,
      });
    } catch (error) {
      console.error("Fetch Notification Settings Error:", error);
      toast.error(
        error.message || "Failed to load notification settings"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    const updatedSettings = {
      ...settings,
      [key]: !settings[key],
    };

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/notification-settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSettings),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update notification settings"
        );
      }

      setSettings({
        rewardCredited: result.data.rewardCredited,
        newSchemesOffers: result.data.newSchemesOffers,
        leadUpdates: result.data.leadUpdates,
        orderEnquiryUpdates: result.data.orderEnquiryUpdates,
        complaintUpdates: result.data.complaintUpdates,
        marketingCampaigns: result.data.marketingCampaigns,
      });

      toast.success("Notification settings updated successfully.");
    } catch (error) {
      console.error("Update Notification Settings Error:", error);
      toast.error(
        error.message || "Failed to update notification settings"
      );
    } finally {
      setSaving(false);
    }
  };

  const notificationItems = [
    {
      key: "rewardCredited",
      label: "Reward Credited",
    },
    {
      key: "newSchemesOffers",
      label: "New Schemes & Offers",
    },
    {
      key: "leadUpdates",
      label: "Lead Updates",
    },
    {
      key: "orderEnquiryUpdates",
      label: "Order / Enquiry Updates",
    },
    {
      key: "complaintUpdates",
      label: "Complaint Updates",
    },
    {
      key: "marketingCampaigns",
      label: "Marketing Campaigns",
    },
  ];

  if (loading) {
    return (
      <div className="painter-notification-settings-page">
        <div className="painter-notification-settings-loading">
          Loading notification settings...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-notification-settings-page">
      <div className="painter-notification-settings-header">
        <h1>Notification Settings</h1>
        <p>Manage your notification preferences</p>
      </div>

      <div className="painter-notification-settings-card">
        <h2>Notification Settings</h2>

        <div className="painter-notification-list">
          {notificationItems.map((item) => (
            <div
              className="painter-notification-row"
              key={item.key}
            >
              <span className="painter-notification-label">
                {item.label}
              </span>

              <button
                type="button"
                className={`painter-notification-toggle ${
                  settings[item.key] ? "active" : ""
                }`}
                onClick={() => handleToggle(item.key)}
                disabled={saving}
                aria-label={`Toggle ${item.label}`}
              >
                <span className="painter-notification-toggle-circle"></span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PainterNotificationSettings;