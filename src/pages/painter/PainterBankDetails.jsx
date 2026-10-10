import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import "../../css/painter/PainterBankDetails.css";

const PainterBankDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const [formData, setFormData] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const [verificationStatus, setVerificationStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/bank-details`,
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
          result.message || "Failed to fetch bank details"
        );
      }

      const data = result.data;

      setFormData({
        accountHolder: data.accountHolder || "",
        bankName: data.bankName || "",
        accountNumber: data.accountNumber || "",
        ifsc: data.ifsc || "",
      });

      setVerificationStatus(
        data.verificationStatus || "Pending"
      );
    } catch (error) {
      console.error("Fetch Bank Details Error:", error);
      toast.error(
        error.message || "Failed to load bank details"
      );
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

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/bank-details`,
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
          result.message || "Failed to update bank details"
        );
      }

      const data = result.data;

      setFormData({
        accountHolder: data.accountHolder || "",
        bankName: data.bankName || "",
        accountNumber: data.accountNumber || "",
        ifsc: data.ifsc || "",
      });

      setVerificationStatus(
        data.verificationStatus || "Pending"
      );

      toast.success("Bank details saved successfully.");
    } catch (error) {
      console.error("Update Bank Details Error:", error);
      toast.error(
        error.message || "Failed to save bank details"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="painter-bank-details-page">
        <div className="painter-bank-details-loading">
          Loading bank details...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-bank-details-page">
      <div className="painter-bank-details-header">
        <div>
          <h1>Bank Details</h1>
          <p>Manage your registered bank information</p>
        </div>
      </div>

      <div className="painter-bank-details-card">
        <h2>Bank Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="painter-bank-details-grid">
            <div className="painter-bank-detail-field">
              <label>Account Holder *</label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
                placeholder="Enter account holder name"
                required
              />
            </div>

            <div className="painter-bank-detail-field">
              <label>Bank Name *</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
                required
              />
            </div>

            <div className="painter-bank-detail-field">
              <label>Account Number *</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
                required
              />
            </div>

            <div className="painter-bank-detail-field">
              <label>IFSC *</label>
              <input
                type="text"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
                placeholder="Enter IFSC code"
                required
              />
            </div>
          </div>

          <div className="painter-bank-verification">
            <ShieldCheck size={17} />
            <span>Verification Status:</span>
            <strong>{verificationStatus}</strong>
          </div>

          <button
            type="submit"
            className="painter-bank-save-btn"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Bank Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PainterBankDetails;