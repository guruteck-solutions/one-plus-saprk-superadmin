import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../css/dealer/DealerPurchaseAnalytics.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerPurchaseAnalytics = () => {
  const [data, setData] = useState({
    summary: {
      monthlyPurchase: 0,
      annualPurchase: 0,
      totalPurchase: 0,
      orderFrequency: 0,
      rewardPointsEarned: 0,
      cashbackEarned: 0,
    },
    productWisePurchase: [],
    categoryWisePurchase: [],
    purchaseTrend: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/dealer/purchase-analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Purchase analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatCurrency = (amount) =>
    `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const categoryTotal = useMemo(() => {
    return data.categoryWisePurchase.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
  }, [data.categoryWisePurchase]);

  const getCategoryPercentage = (amount) => {
    if (!categoryTotal) return 0;

    return ((Number(amount || 0) / categoryTotal) * 100).toFixed(1);
  };

  const getCategoryGradient = () => {
    if (!data.categoryWisePurchase.length || !categoryTotal) {
      return "conic-gradient(#e2e8f0 0deg 360deg)";
    }

    const colors = [
      "#4f46e5",
      "#0ea5e9",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
    ];

    let currentDegree = 0;

    const gradientParts = data.categoryWisePurchase.map(
      (item, index) => {
        const percentage =
          (Number(item.amount || 0) / categoryTotal) * 100;

        const startDegree = currentDegree;
        const endDegree = currentDegree + (percentage * 3.6);

        currentDegree = endDegree;

        return `${colors[index % colors.length]} ${startDegree}deg ${endDegree}deg`;
      }
    );

    return `conic-gradient(${gradientParts.join(", ")})`;
  };

  const maxMonthlyPurchase = Math.max(
    ...data.purchaseTrend.map((item) => Number(item.amount || 0)),
    0
  );

  if (loading) {
    return (
      <div className="dealer-purchase-analytics">
        <div className="purchase-loading">
          Loading purchase analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="dealer-purchase-analytics">

      {/* HEADER */}

      <div className="purchase-analytics-header">
        <div>
          <h1>Purchase Analytics</h1>
          <p>Track your purchase performance and order activity</p>
        </div>

        <button
          className="purchase-refresh-btn"
          onClick={fetchAnalytics}
        >
          Refresh
        </button>
      </div>

      {/* MONTHLY PURCHASE GRAPH */}

      <div className="purchase-main-card">
        <div className="purchase-section-header">
          <div>
            <h2>Monthly Purchase</h2>
            <p>Your recent purchase trend</p>
          </div>

          <strong>
            {formatCurrency(data.summary.monthlyPurchase)}
          </strong>
        </div>

        {data.purchaseTrend.length === 0 ? (
          <div className="purchase-empty">
            No monthly purchase data found
          </div>
        ) : (
          <div className="monthly-purchase-chart">

            <div className="monthly-chart-y-axis">
              <span>
                {formatCurrency(maxMonthlyPurchase)}
              </span>

              <span>
                {formatCurrency(maxMonthlyPurchase / 2)}
              </span>

              <span>₹ 0</span>
            </div>

            <div className="monthly-chart-area">

              <div className="monthly-chart-grid">
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="monthly-bars">
                {data.purchaseTrend.map((item, index) => {
                  const amount = Number(item.amount || 0);

                  const height =
                    maxMonthlyPurchase > 0
                      ? Math.max(
                          (amount / maxMonthlyPurchase) * 100,
                          5
                        )
                      : 5;

                  return (
                    <div
                      className="monthly-bar-item"
                      key={`${item.date}-${index}`}
                    >
                      <div className="monthly-bar-value">
                        {formatCurrency(amount)}
                      </div>

                      <div className="monthly-bar-wrapper">
                        <div
                          className="monthly-bar"
                          style={{
                            height: `${height}%`,
                          }}
                          title={`${formatDate(item.date)} - ${formatCurrency(
                            amount
                          )}`}
                        />
                      </div>

                      <span className="monthly-bar-label">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* TOTAL PURCHASE + TOTAL ORDERS */}

      <div className="purchase-highlight-grid">

        <div className="purchase-highlight-card">
          <div>
            <span>Total Purchase</span>
            <strong>
              {formatCurrency(data.summary.totalPurchase)}
            </strong>
          </div>
        </div>

        <div className="purchase-highlight-card">
          <div>
            <span>Total Orders</span>
            <strong>
              {data.summary.orderFrequency}
            </strong>
          </div>
        </div>

      </div>

      {/* CATEGORY + PRODUCT */}

      <div className="purchase-content-grid">

        {/* CATEGORY DONUT */}

        <div className="purchase-section-card">

          <div className="purchase-section-header">
            <div>
              <h2>Category-wise Purchase</h2>
              <p>Purchase distribution by category</p>
            </div>
          </div>

          {data.categoryWisePurchase.length === 0 ? (
            <div className="purchase-empty">
              No category data found
            </div>
          ) : (
            <div className="category-chart-content">

              <div
                className="category-donut"
                style={{
                  background: getCategoryGradient(),
                }}
              >
                <div className="category-donut-center">
                  <strong>
                    {formatCurrency(categoryTotal)}
                  </strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="category-legend">

                {data.categoryWisePurchase.map(
                  (item, index) => {

                    const colors = [
                      "#4f46e5",
                      "#0ea5e9",
                      "#10b981",
                      "#f59e0b",
                      "#ef4444",
                      "#8b5cf6",
                    ];

                    return (
                      <div
                        className="category-legend-item"
                        key={item.category}
                      >
                        <div className="category-legend-name">
                          <span
                            className="category-dot"
                            style={{
                              background:
                                colors[
                                  index % colors.length
                                ],
                            }}
                          />

                          <span>{item.category}</span>
                        </div>

                        <div className="category-legend-value">
                          <strong>
                            {getCategoryPercentage(
                              item.amount
                            )}
                            %
                          </strong>

                          <span>
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}

              </div>
            </div>
          )}
        </div>

        {/* PRODUCT-WISE */}

        <div className="purchase-section-card">

          <div className="purchase-section-header">
            <div>
              <h2>Product-wise Purchase</h2>
              <p>Purchase amount by product</p>
            </div>
          </div>

          {data.productWisePurchase.length === 0 ? (
            <div className="purchase-empty">
              No product data found
            </div>
          ) : (
            <div className="purchase-product-list">

              {data.productWisePurchase.map(
                (item) => (
                  <div
                    className="purchase-product-row"
                    key={item.productName}
                  >
                    <div>
                      <span className="product-name">
                        {item.productName}
                      </span>

                      <div className="product-progress">
                        <div
                          className="product-progress-fill"
                          style={{
                            width: `${
                              data.summary.totalPurchase
                                ? Math.min(
                                    (Number(item.amount) /
                                      data.summary
                                        .totalPurchase) *
                                      100,
                                    100
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <strong>
                      {formatCurrency(item.amount)}
                    </strong>
                  </div>
                )
              )}

            </div>
          )}
        </div>

      </div>

      {/* ANNUAL + REWARD */}

      <div className="purchase-small-cards">

        <div className="purchase-small-card">
          <span>Annual Purchase</span>
          <strong>
            {formatCurrency(data.summary.annualPurchase)}
          </strong>
        </div>

        <div className="purchase-small-card">
          <span>Reward Points Earned</span>
          <strong>
            {data.summary.rewardPointsEarned}
          </strong>
        </div>

        <div className="purchase-small-card">
          <span>Cashback Earned</span>
          <strong>
            {formatCurrency(data.summary.cashbackEarned)}
          </strong>
        </div>

      </div>

      {/* ADDITIONAL ANALYTICS */}

      <div className="purchase-additional-card">

        <div className="purchase-section-header">
          <div>
            <h2>Additional Analytics</h2>
            <p>Data available from current backend</p>
          </div>
        </div>

        <div className="purchase-additional-grid">

          <div>
            <span>Scheme Achievement</span>
            <strong>Data not available</strong>
          </div>

          <div>
            <span>Loyalty Progress</span>
            <strong>Available in Loyalty Tier</strong>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DealerPurchaseAnalytics;