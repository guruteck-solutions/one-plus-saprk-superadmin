import React, { useEffect, useState } from "react";
import { Target } from "lucide-react";
import "../../css/painter/PainterMilestoneProgress.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterMilestoneProgress = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/analytics/milestone-progress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMilestones(data.milestones || []);
      }
    } catch (error) {
      console.error("Milestone Progress Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRightText = (milestone) => {
    if (milestone.title === "50 Product Scans") {
      return "+250 pts";
    }

    if (milestone.title === "100 Product Scans") {
      return "+500 pts";
    }

    if (milestone.title === "5 Referrals Converted") {
      return "+500";
    }

    if (milestone.title === "Platinum Tier") {
      return "Premium benefits";
    }

    return "";
  };

  if (loading) {
    return (
      <div className="painter-milestone-page">
        <div className="painter-milestone-loading">
          Loading milestone progress...
        </div>
      </div>
    );
  }

  return (
    <div className="painter-milestone-page">
      <div className="painter-milestone-header">
        <h2>Milestone Progress</h2>
        <p>Oneplus Spark PAINTS · Painter experience</p>
      </div>

      <div className="painter-milestone-card">
        <div className="painter-milestone-card-title">
          <h3>Milestone Progress</h3>
          <Target size={21} />
        </div>

        <div className="painter-milestone-list">
          {milestones.map((milestone) => {
            const progress = Math.min(
              100,
              Number(milestone.progress) || 0
            );

            return (
              <div
                className="painter-milestone-item"
                key={milestone.title}
              >
                <div className="painter-milestone-item-header">
                  <span className="painter-milestone-title">
                    {milestone.title}
                  </span>

                  <div className="painter-milestone-info">
                    <span className="painter-milestone-percent">
                      {progress}%
                    </span>

                    <span className="painter-milestone-reward">
                      {getRightText(milestone)}
                    </span>
                  </div>
                </div>

                <div className="painter-milestone-progress-track">
                  <div
                    className={`painter-milestone-progress-fill ${
                      milestone.completed
                        ? "painter-milestone-completed"
                        : ""
                    }`}
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PainterMilestoneProgress;