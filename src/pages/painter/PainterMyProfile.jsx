import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import "../../css/painter/PainterMyProfile.css";

const PainterMyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

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
      console.error("Fetch Profile Error:", error);
      toast.error(
        error.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getProfileImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  if (loading) {
    return (
      <div className="painter-profile-page">
        <div className="painter-profile-loading">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="painter-profile-page">
        <div className="painter-profile-error">
          <p>Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="painter-profile-page">
      <div className="painter-profile-header">
        <div>
          <h1>My Profile</h1>
          <p>View your profile information</p>
        </div>
      </div>

      <div className="painter-profile-card">
        <div className="painter-profile-top">
          <div className="painter-profile-image">
            {profile.profileImage ? (
              <img
                src={getProfileImageUrl(
                  profile.profileImage
                )}
                alt={profile.name || "Painter"}
              />
            ) : (
              <User size={42} />
            )}
          </div>

          <div className="painter-profile-main-info">
            <h2>{profile.name || "-"}</h2>

            <span className="painter-profile-tier">
              {profile.tier || "-"}
            </span>

            <span
              className={`painter-profile-kyc ${
                profile.kycStatus
                  ? profile.kycStatus.toLowerCase()
                  : ""
              }`}
            >
              <ShieldCheck size={15} />
              KYC {profile.kycStatus || "-"}
            </span>
          </div>
        </div>

        <div className="painter-profile-divider"></div>

        <div className="painter-profile-details">
          <div className="painter-profile-detail-item">
            <div className="painter-profile-detail-icon">
              <Phone size={18} />
            </div>

            <div>
              <span>Mobile Number</span>
              <strong>
                {profile.mobile || "-"}
              </strong>
            </div>
          </div>

          <div className="painter-profile-detail-item">
            <div className="painter-profile-detail-icon">
              <Mail size={18} />
            </div>

            <div>
              <span>Email Address</span>
              <strong>
                {profile.email || "-"}
              </strong>
            </div>
          </div>

          <div className="painter-profile-detail-item">
            <div className="painter-profile-detail-icon">
              <MapPin size={18} />
            </div>

            <div>
              <span>City</span>
              <strong>
                {profile.city || "-"}
              </strong>
            </div>
          </div>

          <div className="painter-profile-detail-item">
            <div className="painter-profile-detail-icon">
              <MapPin size={18} />
            </div>

            <div>
              <span>Serviceable Area</span>
              <strong>
                {profile.serviceableArea || "-"}
              </strong>
            </div>
          </div>

          <div className="painter-profile-detail-item">
            <div className="painter-profile-detail-icon">
              <CalendarDays size={18} />
            </div>

            <div>
              <span>Joined Date</span>
              <strong>
                {formatDate(profile.joinedAt)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainterMyProfile;