import React from "react";
import { AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/painter/PainterDuplicateQR.css";

const PainterDuplicateQR = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};

  const handleScanAnother = () => {
    navigate("/painter/barcode-scanner");
  };

  return (
    <div className="painter-duplicate-qr-page">
      <div className="painter-duplicate-qr-header">
        <div>
          <h1>Duplicate QR Popup</h1>
          <p>Oneplus Spark PAINTS • Painter experience</p>
        </div>
      </div>

      <div className="painter-duplicate-qr-container">
        <div className="painter-duplicate-qr-card">
          <div className="painter-duplicate-qr-icon">
            <AlertCircle size={18} />
          </div>

          <h2>Duplicate QR Code</h2>

          <p className="painter-duplicate-qr-message">
            {data.message || "This QR code has already been scanned."}
          </p>

          <button
            type="button"
            className="painter-duplicate-qr-scan-btn"
            onClick={handleScanAnother}
          >
            Scan Another
          </button>

          <p className="painter-duplicate-qr-support">
            If you believe this is an error, contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PainterDuplicateQR;