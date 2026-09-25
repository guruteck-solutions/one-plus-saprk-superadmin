import React, { useEffect, useState } from "react";
import { Share2, Copy } from "lucide-react";
import "../../css/painter/PainterShareProfile.css";

const PainterShareProfile = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShareProfile();
  }, []);

  const fetchShareProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/profile/share`,
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
          result.message || "Failed to fetch share profile"
        );
      }

      setProfile(result.data);
    } catch (error) {
      console.error("Fetch Share Profile Error:", error);
      setError(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const getProfileLink = () => {
    return `${window.location.origin}/painter/profile/preview?id=${profile?.painterId}`;
  };

  const handleWhatsAppShare = () => {
    if (!profile) return;

    const profileLink = getProfileLink();

    const message = `Check out my OnePlus Spark Painter Profile.\n\nName: ${profile.name}\nTier: ${profile.tier}\nRewards Earned: ${profile.rewardsEarned}\n\nView Profile: ${profileLink}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleCopyProfileLink = async () => {
    if (!profile) return;

    try {
      await navigator.clipboard.writeText(getProfileLink());
      alert("Profile link copied successfully.");
    } catch (error) {
      console.error("Copy Profile Link Error:", error);
      alert("Failed to copy profile link.");
    }
  };

  if (loading) {
    return (
      <div className="painter-share-profile-page">
        <div className="painter-share-profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="painter-share-profile-page">
        <div className="painter-share-profile-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="painter-share-profile-page">
      <div className="painter-share-profile-header">
        <h1>Share Profile</h1>
        <p>Share your painter profile with others</p>
      </div>

      <div className="painter-share-profile-card">
        <h2>Share Painter Profile</h2>

        <div className="painter-share-profile-avatar">
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

        <div className="painter-share-profile-tier">
          {profile.tier}
        </div>

        <div className="painter-share-profile-rewards">
          <span>Rewards Earned</span>
          <strong>{profile.rewardsEarned}</strong>
        </div>

        <div className="painter-share-profile-actions">
          <button
            type="button"
            className="painter-share-whatsapp-btn"
            onClick={handleWhatsAppShare}
          >
            <Share2 size={16} />
            Share on WhatsApp
          </button>

          <button
            type="button"
            className="painter-copy-profile-btn"
            onClick={handleCopyProfileLink}
          >
            <Copy size={16} />
            Copy Profile Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default PainterShareProfile;