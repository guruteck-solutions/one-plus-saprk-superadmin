import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import "../../css/painter/PainterEditProfile.css";

const PainterEditProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    serviceableArea: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/painter/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch profile");
      }

      setFormData({
        name: result.data.name || "",
        mobile: result.data.mobile || "",
        email: result.data.email || "",
        serviceableArea: result.data.serviceableArea || "",
        profileImage: result.data.profileImage || "",
      });
    } catch (error) {
      console.error("Fetch Profile Error:", error);
      setError(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

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
        `${API_BASE_URL}/api/painter/profile/edit`,
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
        throw new Error(result.message || "Failed to update profile");
      }

      setFormData({
        name: result.data.name || "",
        mobile: result.data.mobile || "",
        email: result.data.email || "",
        serviceableArea: result.data.serviceableArea || "",
        profileImage: result.data.profileImage || "",
      });

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Update Profile Error:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="painter-edit-profile-page">
        <div className="painter-edit-profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-edit-profile-page">
      <div className="painter-edit-profile-header">
        <div>
          <h1>Edit Profile</h1>
          <p>Update your profile information</p>
        </div>
      </div>

      <div className="painter-edit-profile-card">
        <h2>Edit Profile</h2>

        {error && (
          <div className="painter-edit-profile-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="painter-edit-profile-grid">
            <div className="painter-edit-profile-field">
              <label>Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="painter-edit-profile-field">
              <label>Mobile *</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="painter-edit-profile-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="painter-edit-profile-field">
              <label>Serviceable Area</label>
              <input
                type="text"
                name="serviceableArea"
                value={formData.serviceableArea}
                onChange={handleChange}
                placeholder="Enter serviceable area"
              />
            </div>

            <div className="painter-edit-profile-field painter-edit-profile-full">
              <label>Profile Picture</label>

              <div className="painter-edit-profile-image-input">
                <Camera size={18} />
                <input
                  type="text"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="Profile image URL"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="painter-edit-profile-save-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PainterEditProfile;