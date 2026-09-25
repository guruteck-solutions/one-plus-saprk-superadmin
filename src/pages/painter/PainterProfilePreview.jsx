import React, { useEffect, useState } from "react";
import { Share2, QrCode } from "lucide-react";
import "../../css/painter/PainterProfilePreview.css";

const PainterProfilePreview = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfilePreview();
  }, []);

  const fetchProfilePreview = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/profile/preview`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch profile preview"
        );
      }

      setProfile(result.data);
    } catch (error) {
      console.error("Fetch Profile Preview Error:", error);
      setError(error.message || "Failed to load profile preview");
    } finally {
      setLoading(false);
    }
  };

  const getProfileLink = () => {
    return `${window.location.origin}/painter/profile/preview`;
  };

  const handleShare = async () => {
    if (!profile) return;

    const profileLink = getProfileLink();

    const shareData = {
      title: "Painter Profile",
      text: `Check out ${profile.name}'s Painter Profile`,
      url: profileLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(profileLink);
        alert("Profile link copied successfully.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share Profile Error:", error);
      }
    }
  };

  const formatJoinedDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="painter-profile-preview-page">
        <div className="painter-profile-preview-loading">
          Loading profile preview...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="painter-profile-preview-page">
        <div className="painter-profile-preview-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="painter-profile-preview-page">
      <div className="painter-profile-preview-header">
        <h1>Profile Preview</h1>
        <p>Preview your painter profile</p>
      </div>

      <div className="painter-profile-preview-card">
        <h2>Profile Preview</h2>

        <div className="painter-profile-preview-avatar">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt={profile.name}
            />
          ) : (
            <span>
              {profile.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <h3>{profile.name}</h3>

        <div className="painter-profile-preview-tier">
          {profile.tier}
        </div>

        <div className="painter-profile-preview-reward-label">
          Rewards Earned
        </div>

        <div className="painter-profile-preview-rewards">
          <span>▣</span>
          {profile.rewardsEarned}
        </div>

        <div className="painter-profile-preview-joined">
          Joined {formatJoinedDate(profile.joinedAt)}
        </div>

        <div className="painter-profile-preview-share-box">
          <QrCode size={28} />
          <strong>QR / SHARE CODE</strong>
          <span>{profile.shareCode}</span>
        </div>

        <button
          type="button"
          className="painter-profile-preview-share-btn"
          onClick={handleShare}
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
};

export default PainterProfilePreview;