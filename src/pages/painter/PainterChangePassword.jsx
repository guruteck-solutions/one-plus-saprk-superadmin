import React, { useState } from "react";
import "../../css/painter/PainterChangePassword.css";

const PainterChangePassword = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to update password"
        );
      }

      alert("Password updated successfully.");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change Password Error:", error);
      setError(error.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="painter-change-password-page">
      <div className="painter-change-password-header">
        <h1>Change Password</h1>
        <p>Update your account password</p>
      </div>

      <div className="painter-change-password-card">
        <h2>Change Password</h2>

        {error && (
          <div className="painter-change-password-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="painter-change-password-field">
            <label>Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="painter-change-password-field">
            <label>New Password *</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="painter-change-password-field">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            className="painter-change-password-btn"
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PainterChangePassword;