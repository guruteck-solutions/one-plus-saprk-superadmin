import React, { useEffect, useState } from "react";
import "../../css/painter/PainterSchemePerformance.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterSchemePerformance = () => {
  const [summary, setSummary] = useState({
    totalSchemes: 0,
    achieved: 0,
    inProgress: 0,
    remaining: 0,
  });

  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSchemePerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/scheme-performance`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch scheme performance"
        );
      }

      setSummary(
        data.summary || {
          totalSchemes: 0,
          achieved: 0,
          inProgress: 0,
          remaining: 0,
        }
      );

      setPerformance(
        Array.isArray(data.performance)
          ? data.performance
          : []
      );
    } catch (err) {
      console.error(
        "Scheme performance error:",
        err
      );

      setError(
        err.message ||
          "Failed to load scheme performance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemePerformance();
  }, []);

  const getProgressWidth = (percentage) => {
    const value = Number(percentage || 0);

    return Math.min(Math.max(value, 0), 100);
  };

  if (loading) {
    return (
      <div className="painter-scheme-performance-page">
        <div className="painter-scheme-performance-loading">
          Loading scheme performance...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="painter-scheme-performance-page">
        <div className="painter-scheme-performance-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="painter-scheme-performance-page">
      {/* Header */}
      <div className="painter-scheme-performance-header">
        <div>
          <h1>Scheme Performance</h1>
          <p>
            Track your scheme achievements and progress
          </p>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="painter-scheme-achievement-card">
        <div className="painter-scheme-section-title">
          <h2>Scheme Achievement</h2>
          <span>
            {summary.totalSchemes} Total Schemes
          </span>
        </div>

        <div className="painter-scheme-achievement-content">
          <div className="painter-scheme-donut-wrapper">
            <div
              className="painter-scheme-donut"
              style={{
                background: `conic-gradient(
                  #4f46e5 0deg 0deg,
                  #22c55e 0deg 0deg,
                  #f59e0b 0deg 0deg
                )`,
              }}
            >
              <div className="painter-scheme-donut-center">
                <strong>{summary.totalSchemes}</strong>
                <span>Schemes</span>
              </div>
            </div>
          </div>

          <div className="painter-scheme-achievement-stats">
            <div className="painter-scheme-stat">
              <span className="painter-scheme-stat-dot achieved"></span>

              <div>
                <strong>{summary.achieved}</strong>
                <span>Achieved</span>
              </div>
            </div>

            <div className="painter-scheme-stat">
              <span className="painter-scheme-stat-dot progress"></span>

              <div>
                <strong>{summary.inProgress}</strong>
                <span>In Progress</span>
              </div>
            </div>

            <div className="painter-scheme-stat">
              <span className="painter-scheme-stat-dot remaining"></span>

              <div>
                <strong>{summary.remaining}</strong>
                <span>Remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Performance */}
      <div className="painter-scheme-performance-card">
        <div className="painter-scheme-section-title">
          <div>
            <h2>Scheme Performance</h2>
            <p>
              Individual scheme achievement
            </p>
          </div>
        </div>

        {performance.length === 0 ? (
          <div className="painter-scheme-empty">
            <h3>No schemes found</h3>
            <p>
              Available schemes will appear here.
            </p>
          </div>
        ) : (
          <div className="painter-scheme-list">
            {performance.map((scheme) => (
              <div
                className="painter-scheme-item"
                key={scheme._id}
              >
                <div className="painter-scheme-item-top">
                  <div>
                    <h3>{scheme.schemeName || "-"}</h3>

                    <span>
                      {scheme.schemeId || "-"}
                    </span>
                  </div>

                  <strong>
                    {scheme.achievementPercentage || 0}%
                  </strong>
                </div>

                <div className="painter-scheme-progress-track">
                  <div
                    className="painter-scheme-progress-fill"
                    style={{
                      width: `${getProgressWidth(
                        scheme.achievementPercentage
                      )}%`,
                    }}
                  ></div>
                </div>

                <div className="painter-scheme-item-bottom">
                  <span>
                    Achieved: {scheme.achieved || 0}
                  </span>

                  <span>
                    Target: {scheme.target || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PainterSchemePerformance;