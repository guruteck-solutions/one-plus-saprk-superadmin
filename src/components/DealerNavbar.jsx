import React, { useEffect, useState } from "react";
import { Bell, Menu, UserCircle } from "lucide-react";
import "../css/dealer/DealerNavbar.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerNavbar = ({ onMenuClick }) => {
  const [profile, setProfile] = useState(null);
  const [loyaltyTier, setLoyaltyTier] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dealer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const fetchLoyaltyTier = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dealer/loyalty-tier`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Loyalty API Response:", data);

      if (response.ok) {
        const tierName = data?.data?.currentTier?.tierName || "";
setLoyaltyTier(tierName);

        setLoyaltyTier(tierName);
      }
    } catch (error) {
      console.error("Loyalty tier fetch error:", error);
    }
  };

  if (token) {
    fetchProfile();
    fetchLoyaltyTier();
  }
}, [token]);

  const profileImage = profile?.profilePicture
    ? `${API_BASE_URL}${profile.profilePicture}`
    : "";

  return (
    <header className="dealer-navbar">
      <div className="dealer-navbar-left">
        <button
          type="button"
          className="dealer-navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="dealer-navbar-brand">
          <h2>OnePlus Spark</h2>
          <span>Dealer Portal</span>
        </div>
      </div>

      <div className="dealer-navbar-right">
        <div className="dealer-navbar-dealer-info">
          <div className="dealer-navbar-profile-image">
            {profileImage ? (
              <img src={profileImage} alt="Dealer Profile" />
            ) : (
              <UserCircle size={25} />
            )}
          </div>

          <div className="dealer-navbar-details">
            <strong>{profile?.dealerName || "Dealer"}</strong>
            <span>{profile?.businessName || "Business Name"}</span>
          </div>

          <span className="dealer-navbar-loyalty">
            {loyaltyTier || "Loading..."}
          </span>
        </div>

        <button
          type="button"
          className="dealer-navbar-icon-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
};

export default DealerNavbar;