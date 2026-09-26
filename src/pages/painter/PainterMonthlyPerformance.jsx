
import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import "../../css/painter/PainterMonthlyPerformance.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterMonthlyPerformance = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMonthlyPerformance = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/api/painter/analytics/monthly-performance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch monthly performance"
          );
        }

        setMonthlyData(data.monthlyPerformance || []);
      } catch (err) {
        console.error("Monthly Performance Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyPerformance();
  }, []);

  const maxScans = Math.max(
    ...monthlyData.map((item) => Number(item.scans) || 0),
    1
  );

  const formatAchievement = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "Not defined"
    ) {
      return "—";
    }

    return typeof value === "number" ? `${value}%` : value;
  };

  return (
    <div className="painter-monthly-page">
      <div className="painter-monthly-header">
        <h2>Monthly Performance</h2>
        <p>Oneplus Spark PAINTS · Painter experience</p>
      </div>

      {loading ? (
        <div className="painter-monthly-message">
          Loading monthly performance...
        </div>
      ) : error ? (
        <div className="painter-monthly-message painter-monthly-error">
          {error}
        </div>
      ) : (
        <>
          <div className="painter-monthly-chart-card">
            <div className="painter-monthly-card-heading">
              <h3>Monthly Performance</h3>
              <BarChart3 size={20} />
            </div>

            <div className="painter-monthly-chart">
              {monthlyData.map((item, index) => {
                const scans = Number(item.scans) || 0;
                const height = (scans / maxScans) * 100;
                const isLatest = index === monthlyData.length - 1;

                return (
                  <div
                    className="painter-monthly-chart-item"
                    key={`${item.month}-${item.year}`}
                  >
                    <div className="painter-monthly-bar-area">
                      <div
                        className={`painter-monthly-bar ${
                          isLatest ? "painter-monthly-bar-active" : ""
                        }`}
                        style={{
                          height: scans > 0 ? `${height}%` : "3px",
                        }}
                        title={`${item.month}: ${scans} scans`}
                      >
                        {scans > 0 && (
                          <span className="painter-monthly-bar-value">
                            {scans}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="painter-monthly-chart-label">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="painter-monthly-table-card">
            <div className="painter-monthly-table-scroll">
              <table className="painter-monthly-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Scans</th>
                    <th>Rewards</th>
                    <th>Leads</th>
                    <th>Achievement</th>
                  </tr>
                </thead>

                <tbody>
                  {[...monthlyData].reverse().map((item) => (
                    <tr key={`${item.month}-${item.year}`}>
                      <td>{item.month} {item.year}</td>
                      <td>{item.scans || 0}</td>
                      <td>{item.rewardsEarned || 0}</td>
                      <td>{item.leads || 0}</td>
                      <td>{formatAchievement(item.achievement)}</td>
                    </tr>
                  ))}

                  {monthlyData.length === 0 && (
                    <tr>
                      <td colSpan="5" className="painter-monthly-empty">
                        No monthly performance data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PainterMonthlyPerformance;