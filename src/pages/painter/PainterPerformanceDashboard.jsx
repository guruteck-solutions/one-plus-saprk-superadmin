import React, { useEffect, useState } from "react";
import {
  Award,
  ScanLine,
  Wallet,
  Users,
  TrendingUp,
} from "lucide-react";
import "../../css/painter/PainterPerformanceDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterPerformanceDashboard = () => {
  const [summary, setSummary] = useState({
    rewardPoints: 0,
    scans: 0,
    cashback: 0,
    leadsCompleted: 0,
  });

  const [performanceTrend, setPerformanceTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceDashboard();
  }, []);

  const fetchPerformanceDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/analytics/performance-dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary || {});
        setPerformanceTrend(data.performanceTrend || []);
      }
    } catch (error) {
      console.error(
        "Performance Dashboard Error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="painter-performance-page">
        <div className="painter-performance-loading">
          Loading performance dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-performance-page">
      <div className="painter-performance-header">
        <div>
          <h2>Performance Dashboard</h2>
          <p>
            Track your rewards, scans and completed leads
          </p>
        </div>
      </div>

      <div className="painter-performance-summary-grid">
        <div className="painter-performance-card">
          <div className="painter-performance-card-icon">
            <Award size={22} />
          </div>

          <div>
            <span>Reward Points</span>
            <h3>{summary.rewardPoints || 0}</h3>
          </div>
        </div>

        <div className="painter-performance-card">
          <div className="painter-performance-card-icon">
            <ScanLine size={22} />
          </div>

          <div>
            <span>Product Scans</span>
            <h3>{summary.scans || 0}</h3>
          </div>
        </div>

        <div className="painter-performance-card">
          <div className="painter-performance-card-icon">
            <Wallet size={22} />
          </div>

          <div>
            <span>Cashback</span>
            <h3>₹{summary.cashback || 0}</h3>
          </div>
        </div>

        <div className="painter-performance-card">
          <div className="painter-performance-card-icon">
            <Users size={22} />
          </div>

          <div>
            <span>Leads Completed</span>
            <h3>{summary.leadsCompleted || 0}</h3>
          </div>
        </div>
      </div>

      <div className="painter-performance-section">
        <div className="painter-performance-section-header">
          <div>
            <h3>Performance Trend</h3>
            <p>Valid product scans over the last 6 months</p>
          </div>

          <TrendingUp size={21} />
        </div>

        <div className="painter-performance-chart">
          {performanceTrend.length > 0 ? (
            performanceTrend.map((item) => {
              const maxScans = Math.max(
                ...performanceTrend.map(
                  (trend) => trend.scans || 0
                ),
                1
              );

              const height =
                ((item.scans || 0) / maxScans) * 100;

              return (
                <div
                  className="painter-performance-bar-wrapper"
                  key={`${item.month}-${item.year}`}
                >
                  <div className="painter-performance-bar-area">
                    <div
                      className="painter-performance-bar"
                      style={{
                        height: `${Math.max(
                          height,
                          item.scans > 0 ? 8 : 3
                        )}%`,
                      }}
                      title={`${item.scans} scans`}
                    >
                      <span>{item.scans}</span>
                    </div>
                  </div>

                  <span className="painter-performance-month">
                    {item.month}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="painter-performance-empty">
              No performance data available.
            </div>
          )}
        </div>
      </div>

      <div className="painter-performance-section">
        <div className="painter-performance-section-header">
          <div>
            <h3>Achievement</h3>
            <p>Current performance achievement status</p>
          </div>

          <Award size={21} />
        </div>

        <div className="painter-performance-achievement">
          <div className="painter-performance-achievement-icon">
            <Award size={25} />
          </div>

          <div>
            <h4>Performance Tracking</h4>
            <p>
              Your current performance data is being
              tracked through scans, rewards and leads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainterPerformanceDashboard;