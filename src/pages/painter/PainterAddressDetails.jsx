import React, { useEffect, useState } from "react";
import "../../css/painter/PainterAddressDetails.css";

const PainterAddressDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAddressDetails();
  }, []);

  const fetchAddressDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/address-details`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setLoading(false);
          return;
        }

        throw new Error(result.message || "Failed to fetch address details");
      }

      const data = result.data;

      setFormData({
        address: data.address || "",
        city: data.city || "",
        district: data.district || "",
        state: data.state || "",
        pinCode: data.pinCode || "",
      });
    } catch (error) {
      console.error("Fetch Address Details Error:", error);
      setError(error.message || "Failed to load address details");
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
        `${API_BASE_URL}/api/painter/address-details`,
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
          result.message || "Failed to update address details"
        );
      }

      setFormData({
        address: result.data.address || "",
        city: result.data.city || "",
        district: result.data.district || "",
        state: result.data.state || "",
        pinCode: result.data.pinCode || "",
      });

      alert("Address details saved successfully.");
    } catch (error) {
      console.error("Save Address Details Error:", error);
      setError(error.message || "Failed to save address details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="painter-address-details-page">
        <div className="painter-address-details-loading">
          Loading address details...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-address-details-page">
      <div className="painter-address-details-header">
        <h1>Address Details</h1>
        <p>Manage your registered address information</p>
      </div>

      <div className="painter-address-details-card">
        <h2>Address Details</h2>

        {error && (
          <div className="painter-address-details-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="painter-address-details-grid">
            <div className="painter-address-detail-field painter-address-full-field">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
              />
            </div>

            <div className="painter-address-detail-field">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="painter-address-detail-field">
              <label>District *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter district"
                required
              />
            </div>

            <div className="painter-address-detail-field">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            </div>

            <div className="painter-address-detail-field">
              <label>PIN Code *</label>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="Enter PIN code"
                maxLength="6"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="painter-address-save-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PainterAddressDetails;