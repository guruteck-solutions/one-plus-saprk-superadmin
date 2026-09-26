import React, { useEffect, useState } from "react";
import "../../css/painter/PainterLeaderboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/analytics/leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch leaderboard"
        );
      }

      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Leaderboard Error:", error);
      setError(error.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="painter-leaderboard-page">
      <div className="painter-leaderboard-header">
        <h2>Leaderboard (Future)</h2>
        <p>Oneplus Spark PAINTS · Painter experience</p>
      </div>

      <div className="painter-leaderboard-card">
        <div className="painter-leaderboard-card-header">
          <h3>Leaderboard (Future)</h3>

          <span className="painter-leaderboard-future-badge">
            Future Enhancement
          </span>
        </div>

        {loading ? (
          <div className="painter-leaderboard-message">
            Loading leaderboard...
          </div>
        ) : error ? (
          <div className="painter-leaderboard-message painter-leaderboard-error">
            {error}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="painter-leaderboard-message">
            <h4>No leaderboard data available</h4>
            <p>
              Leaderboard data will appear here when painter
              performance data is available.
            </p>
          </div>
        ) : (
          <div className="painter-leaderboard-table-wrapper">
            <table className="painter-leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Painter</th>
                  <th>Tier</th>
                  <th>Points</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((item) => (
                  <tr key={item.painterId || item.rank}>
                    <td>{item.rank}</td>

                    <td className="painter-leaderboard-name">
                      {item.painterName || "—"}
                    </td>

                    <td>
                      {item.tier || "—"}
                    </td>

                    <td>
                      {Number(item.points || 0).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span className="painter-leaderboard-status">
                        —
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PainterLeaderboard;