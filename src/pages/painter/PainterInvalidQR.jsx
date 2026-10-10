import React from "react";
import { AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/painter/PainterInvalidQR.css";

const PainterInvalidQR = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};

  const handleScanAnother = () => {
    navigate("/painter/barcode-scanner");
  };

  return (
    <div className="painter-invalid-qr-page">
      <div className="painter-invalid-qr-header">
        <div>
          <h1>Invalid QR Popup</h1>
          <p>Oneplus Spark PAINTS • Painter experience</p>
        </div>
      </div>

      <div className="painter-invalid-qr-container">
        <div className="painter-invalid-qr-card">
          <div className="painter-invalid-qr-icon">
            <AlertCircle size={18} />
          </div>

          <h2>Invalid QR Code</h2>

          <p className="painter-invalid-qr-message">
            {data.message || "This QR code could not be verified."}
          </p>

          <button
            type="button"
            className="painter-invalid-qr-scan-btn"
            onClick={handleScanAnother}
          >
            Scan Another
          </button>

          <p className="painter-invalid-qr-support">
            If you believe this is an error, contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PainterInvalidQR;