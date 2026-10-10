import React, { useState } from "react";
import { toast } from "sonner";
import "../../css/painter/PainterEmailSupport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterEmailSupport = () => {
  const [formData, setFormData] = useState({
    subject: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/painter/support/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit support request");
      }

      toast.success("Support request submitted successfully.");

      setFormData({
        subject: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Email Support Error:", error);
      toast.error(error.message || "Failed to submit support request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="painter-email-support-page">
      <div className="painter-email-support-header">
        <h1>Email Support</h1>
        <p>Oneplus Spark PAINTS • Painter experience</p>
      </div>

      <div className="painter-email-support-card">
        <h2>Email Support</h2>

        <form
          className="painter-email-support-form"
          onSubmit={handleSubmit}
        >
          <div className="painter-email-support-field">
            <label htmlFor="subject">Subject *</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="painter-email-support-field">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="painter-email-support-field">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <div className="painter-email-support-submit">
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PainterEmailSupport;