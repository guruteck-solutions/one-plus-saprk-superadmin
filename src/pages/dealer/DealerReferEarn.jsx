import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import "../../css/dealer/DealerReferEarn.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerReferEarn = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    referredName: "",
    referredMobile: "",
    referredEmail: "",
    remarks: "",
  });

  const categories = [
    "Dealer",
    "Painter",
    "Builder",
    "Contractor",
    "Engineer",
    "Architect",
    "Retailer",
    "Interior Designer",
    "Other",
  ];

  const fetchReferrals = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/dealer/referrals`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setReferrals(response.data.referrals || []);
      }
    } catch (error) {
      console.error("Referral fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load referrals"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/api/dealer/referrals`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const newReferral = response.data.referral;

        toast.success("Referral created successfully");

        setFormData({
          category: "",
          referredName: "",
          referredMobile: "",
          referredEmail: "",
          remarks: "",
        });

        setShowModal(false);

        setSelectedReferral(newReferral);
        setShowShareCard(true);

        fetchReferrals();
      }
    } catch (error) {
      console.error("Create referral error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create referral"
      );
    }
  };

  const getReferralLink = (referral) => {
    if (!referral?.referralCode) return "";

    return `${window.location.origin}/refer/${referral.referralCode}`;
  };

  const handleCopyLink = async () => {
    if (!selectedReferral) return;

    const referralLink = getReferralLink(selectedReferral);

    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);

      toast.success("Referral link copied successfully");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy referral link error:", error);
      toast.error("Failed to copy referral link");
    }
  };

  const handleWhatsAppShare = () => {
    if (!selectedReferral) return;

    const referralLink = getReferralLink(selectedReferral);

    const message = `Join OnePlus Spark through my referral link and get exciting rewards:
${referralLink}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleExistingReferralShare = (referral) => {
    setSelectedReferral(referral);
    setShowShareCard(true);
    setCopied(false);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="dealer-refer-earn">
      {/* ================= HEADER ================= */}

      <div className="refer-earn-header">
        <div>
          <h1>Refer & Earn</h1>
          <p>Refer people and earn exciting rewards</p>
        </div>

        <button
          className="refer-share-btn"
          onClick={() => setShowModal(true)}
        >
          Share Referral
        </button>
      </div>

      {/* ================= CATEGORIES ================= */}

      <div className="refer-category-card">
        <h2>Referral Categories</h2>

        <div className="refer-category-list">
          {categories.map((category) => (
            <span
              key={category}
              className="refer-category-item"
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* ================= REFERRAL HISTORY ================= */}

      <div className="refer-history-card">
        <div className="refer-history-header">
          <div>
            <h2>Referral History</h2>
            <p>Your created referrals</p>
          </div>

          <span className="refer-count">
            {referrals.length} Referrals
          </span>
        </div>

        {loading ? (
          <div className="refer-empty">
            Loading referrals...
          </div>
        ) : referrals.length === 0 ? (
          <div className="refer-empty">
            No referrals found
          </div>
        ) : (
          <div className="refer-table-wrapper">
            <table className="refer-table">
              <thead>
                <tr>
                  <th>Referral ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Mobile</th>
                  <th>Referral Code</th>
                  <th>Reward</th>
                  <th>Date</th>
                  <th>Share</th>
                </tr>
              </thead>

              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral._id}>
                    <td>{referral.referralId}</td>

                    <td>{referral.referredName}</td>

                    <td>{referral.category}</td>

                    <td>{referral.referredMobile}</td>

                    <td>
                      <span className="refer-code">
                        {referral.referralCode}
                      </span>
                    </td>

                    <td>
                      {referral.rewardPoints} Points
                    </td>

                    <td>
                      {formatDate(referral.createdAt)}
                    </td>

                    <td>
                      <button
                        className="refer-table-share-btn"
                        onClick={() =>
                          handleExistingReferralShare(
                            referral
                          )
                        }
                      >
                        Share
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= CREATE REFERRAL MODAL ================= */}

      {showModal && (
        <div className="refer-modal-overlay">
          <div className="refer-modal">
            <div className="refer-modal-header">
              <div>
                <h2>Create Referral</h2>
                <p>
                  Enter the details of the person you want
                  to refer
                </p>
              </div>

              <button
                className="refer-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="refer-form-group">
                <label>Category</label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="refer-form-group">
                <label>Name</label>

                <input
                  type="text"
                  name="referredName"
                  value={formData.referredName}
                  onChange={handleChange}
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="refer-form-group">
                <label>Mobile</label>

                <input
                  type="tel"
                  name="referredMobile"
                  value={formData.referredMobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="refer-form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="referredEmail"
                  value={formData.referredEmail}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </div>

              <div className="refer-form-group">
                <label>Remarks</label>

                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks"
                  rows="3"
                />
              </div>

              <button
                type="submit"
                className="refer-submit-btn"
              >
                Create Referral
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= SHARE REFERRAL CARD ================= */}

      {showShareCard && selectedReferral && (
        <div className="refer-share-overlay">
          <div className="refer-share-card">
            <button
              className="refer-share-close"
              onClick={() => setShowShareCard(false)}
            >
              ×
            </button>

            <div className="refer-share-illustration">
              <div className="refer-person refer-person-one">
                <div className="person-head"></div>
                <div className="person-body"></div>
              </div>

              <div className="refer-person refer-person-two">
                <div className="person-head"></div>
                <div className="person-body"></div>
              </div>
            </div>

            <div className="refer-share-content">
              <h2>Refer & Earn</h2>

              <h3>Grow Together</h3>

              <p>
                Share your referral link and earn
                exciting rewards.
              </p>
            </div>

            <div className="refer-link-box">
              <span className="refer-link-icon">
                ↗
              </span>

              <span className="refer-link-text">
                {getReferralLink(selectedReferral)}
              </span>
            </div>

            <div className="refer-share-actions">
              <button
                className="refer-copy-btn"
                onClick={handleCopyLink}
              >
                <span>⧉</span>
                {copied ? "Copied" : "Copy Link"}
              </button>

              <button
                className="refer-whatsapp-btn"
                onClick={handleWhatsAppShare}
              >
                <span>◉</span>
                Share via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerReferEarn;