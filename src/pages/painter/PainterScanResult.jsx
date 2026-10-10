import React from "react";
import {
  CheckCircle2,
  ArrowLeft,
  Package,
  Award,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/painter/PainterScanResult.css";

const PainterScanResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};
  const product = data.product || {};
  const scan = data.scan || {};

  const handleViewReward = () => {
    navigate("/painter/reward-history");
  };

  return (
    <div className="painter-scan-result-page">

      {/* Header */}
      <div className="painter-scan-result-header">
        <div>
          <h1>Scan Result</h1>
          <p>Oneplus Spark PAINTS • Painter experience</p>
        </div>
      </div>

      {/* Result Card */}
      <div className="painter-scan-result-card">

        {/* Success Section */}
        <div className="painter-scan-result-success">
          <div className="painter-scan-result-success-icon">
            <CheckCircle2 size={30} />
          </div>

          <h2>Product Verified</h2>

          <p>
            {data.message ||
              "Barcode scanned and verified successfully"}
          </p>
        </div>

        {/* Product Information */}
        <div className="painter-scan-result-section">

          <div className="painter-scan-result-section-title">
            <Package size={18} />
            <h3>Product Details</h3>
          </div>

          <div className="painter-scan-result-details">

            <div className="painter-scan-result-detail-item">
              <span>Product</span>
              <strong>
                {product.productName || "-"}
              </strong>
            </div>

            <div className="painter-scan-result-detail-item">
              <span>SKU</span>
              <strong>
                {product.sku || "-"}
              </strong>
            </div>

            <div className="painter-scan-result-detail-item">
              <span>Barcode</span>
              <strong>
                {product.barcode || scan.scanCode || "-"}
              </strong>
            </div>

            <div className="painter-scan-result-detail-item">
              <span>Category</span>
              <strong>
                {product.category || "-"}
              </strong>
            </div>

            <div className="painter-scan-result-detail-item">
              <span>Brand</span>
              <strong>
                {product.brand || "-"}
              </strong>
            </div>

            <div className="painter-scan-result-detail-item">
              <span>Packing Size</span>
              <strong>
                {product.packingSize || "-"}
              </strong>
            </div>

            <div className="painter-scan-result-detail-item">
              <span>MRP</span>
              <strong>
                ₹{product.mrp ?? 0}
              </strong>
            </div>

          </div>
        </div>

        {/* Reward */}
        <div className="painter-scan-result-reward-card">

          <div className="painter-scan-result-reward-icon">
            <Award size={22} />
          </div>

          <div className="painter-scan-result-reward-info">
            <span>Reward Points</span>
            <strong>
              {data.rewardPoints ?? 0}
            </strong>
          </div>

        </div>

        {/* View Reward */}
        <button
          type="button"
          className="painter-scan-result-reward-btn"
          onClick={handleViewReward}
        >
          View Reward
        </button>

        {/* Back */}
        <button
          type="button"
          className="painter-scan-result-back-btn"
          onClick={() =>
            navigate("/painter/barcode-scanner")
          }
        >
          <ArrowLeft size={16} />
          <span>Back to Scanner</span>
        </button>

      </div>
    </div>
  );
};

export default PainterScanResult;