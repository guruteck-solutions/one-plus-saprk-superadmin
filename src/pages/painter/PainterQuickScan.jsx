import React, { useState } from "react";
import { Camera, QrCode, ScanLine } from "lucide-react";
import "../../css/painter/PainterQuickScan.css";

const PainterQuickScan = () => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(manualCode)) {
      setMessage("Please enter a valid 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/painter/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scanCode: manualCode,
          scanType: "MANUAL",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("Product scanned successfully.");
        setManualCode("");
        setShowManualInput(false);
      } else {
        setMessage(data.message || "Failed to process scan.");
      }
    } catch (error) {
      console.error("Manual scan error:", error);
      setMessage("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCamera = () => {
    setMessage("Camera scanner will open here.");
  };

  return (
    <div className="painter-quick-scan">
      <div className="painter-quick-scan-header">
        <div>
          <h1>Quick Scan</h1>
          <p>Oneplus Spark PAINTS • Painter experience</p>
        </div>
      </div>

      <div className="painter-quick-scan-card">
        <div className="painter-scan-title">
          <h2>Scan Product</h2>
          <p>Align the QR / barcode inside the frame</p>
        </div>

        <div className="painter-scan-frame">
          <div className="painter-scan-frame-content">
            <ScanLine size={32} />
            <span>QR / BARCODE</span>
          </div>
        </div>

        <button
          type="button"
          className="painter-open-camera-btn"
          onClick={handleOpenCamera}
        >
          <Camera size={17} />
          <span>Open Camera</span>
        </button>

        <button
          type="button"
          className="painter-manual-code-btn"
          onClick={() => {
            setShowManualInput((prev) => !prev);
            setMessage("");
          }}
        >
          Manual 6-digit code
        </button>

        {showManualInput && (
          <form
            className="painter-manual-code-form"
            onSubmit={handleManualSubmit}
          >
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit code"
              value={manualCode}
              onChange={(e) =>
                setManualCode(e.target.value.replace(/\D/g, ""))
              }
            />

            <button type="submit" disabled={loading}>
              {loading ? "Scanning..." : "Scan Code"}
            </button>
          </form>
        )}

        {message && (
          <p className="painter-scan-message">{message}</p>
        )}
      </div>

      <div className="painter-quick-scan-footer">
        © Oneplus Spark PAINTS • Painter Mobile App UI
      </div>
    </div>
  );
};

export default PainterQuickScan;