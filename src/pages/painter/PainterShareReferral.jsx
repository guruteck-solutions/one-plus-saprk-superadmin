import React, { useEffect, useState } from "react";
import { Share2, Copy } from "lucide-react";
import "../../css/painter/PainterShareReferral.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterShareReferral = () => {
    const [referral, setReferral] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchReferral();
    }, []);

    const fetchReferral = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/api/painter/referrals/share`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch referral details"
                );
            }

            setReferral(data.referral || null);
        } catch (error) {
            console.error("Fetch share referral error:", error);
            setError(error.message || "Failed to load referral details");
        } finally {
            setLoading(false);
        }
    };

    const referralCode = referral?.referralCode || "";

    const referralLink = referralCode
        ? `${window.location.origin}/referral/${referralCode}`
        : "";

    const handleCopyLink = async () => {
        if (!referralLink) return;

        try {
            await navigator.clipboard.writeText(referralLink);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Copy referral link error:", error);
        }
    };

    const handleWhatsAppShare = () => {
        if (!referralCode) return;

        const message = `Join through my referral code: ${referralCode}`;

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
            message
        )}`;

        window.open(whatsappUrl, "_blank");
    };

    if (loading) {
        return (
            <div className="painter-share-referral-page">
                <div className="painter-share-referral-state">
                    Loading referral details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="painter-share-referral-page">
                <div className="painter-share-referral-state error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="painter-share-referral-page">
            <div className="painter-share-referral-header">
                <h1>Share Referral</h1>

                <p>
                    Painter App <span>/</span> Refer & Earn{" "}
                    <span>/</span> Share Referral
                </p>
            </div>

            <div className="painter-share-referral-wrapper">
                <div className="painter-share-referral-card">
                    <h2>Share Referral</h2>

                    <p className="painter-share-referral-label">
                        Referral link
                    </p>

                    <div className="painter-share-referral-field-group">
                        <label htmlFor="referral-code">
                            Referral Code
                        </label>

                        <input
                            id="referral-code"
                            type="text"
                            value={referralCode}
                            readOnly
                        />
                    </div>

                    <div className="painter-share-referral-actions">
                        <button
                            type="button"
                            className="painter-share-whatsapp-btn"
                            onClick={handleWhatsAppShare}
                            disabled={!referralCode}
                        >
                            <Share2 size={16} />
                            Share on WhatsApp
                        </button>

                        <button
                            type="button"
                            className="painter-copy-link-btn"
                            onClick={handleCopyLink}
                            disabled={!referralLink}
                        >
                            <Copy size={16} />
                            {copied ? "Link Copied" : "Copy Link"}
                        </button>
                    </div>

                    <p className="painter-share-referral-info">
                        Earn rewards when your referral registers and qualifies.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PainterShareReferral;