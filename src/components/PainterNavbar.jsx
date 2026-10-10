import React, { useEffect, useState } from "react";
import { Bell, Menu, UserCircle } from "lucide-react";
import "../css/painter/PainterNavbar.css";

const PainterNavbar = ({ onMenuClick }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/painter/profile`,
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
          result.message || "Failed to fetch profile"
        );
      }

      setProfile(result.data);
    } catch (error) {
      console.error("Navbar Profile Error:", error);
    }
  };

  const getProfileImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  return (
    <header className="painter-navbar">
      <div className="painter-navbar-left">
        <button
          type="button"
          className="painter-navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="painter-navbar-brand">
          <h2>OnePlus Spark</h2>
          <span>Painter Portal</span>
        </div>
      </div>

      <div className="painter-navbar-right">
        <button
          type="button"
          className="painter-navbar-icon-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <button
          type="button"
          className="painter-navbar-profile"
          title="Profile"
        >
          <div className="painter-navbar-profile-image">
            {profile?.profileImage ? (
              <img
                src={getProfileImageUrl(
                  profile.profileImage
                )}
                alt={profile.name || "Painter"}
              />
            ) : (
              <UserCircle size={24} />
            )}
          </div>

          <span>{profile?.name || "Painter"}</span>
        </button>
      </div>
    </header>
  );
};

export default PainterNavbar;