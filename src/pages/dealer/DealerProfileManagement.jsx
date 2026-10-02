import React, { useEffect, useState } from "react";
import { Camera, Lock, Save, Upload, User, Building2, Landmark, Bell, Share2, Copy, MessageCircle, } from "lucide-react";
import "../../css/dealer/DealerProfileManagement.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerProfileManagement = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [profileForm, setProfileForm] = useState({
        dealerName: "",
        businessName: "",
        mobileNumber: "",
        email: "",
        gstNumber: "",
        panNumber: "",
        shopActNumber: "",
        registrationDate: "",
        businessAddress: "",
        city: "",
        district: "",
        state: "",
        pinCode: "",
    });

    const [bankForm, setBankForm] = useState({
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        ifsc: "",
    });

    const [notificationForm, setNotificationForm] = useState({
        orderUpdates: true,
        paymentUpdates: true,
        rewardUpdates: true,
        promotionalCampaigns: true,
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState("");

    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/api/dealer/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch profile");
            }

            setProfile(data.profile);

            setProfileForm({
                dealerName: data.profile.dealerName || "",
                businessName: data.profile.businessName || "",
                mobileNumber: data.profile.mobileNumber || "",
                email: data.profile.email || "",
                gstNumber: data.profile.gstNumber || "",
                panNumber: data.profile.panNumber || "",
                shopActNumber: data.profile.shopActNumber || "",
                registrationDate: data.profile.registrationDate
                    ? data.profile.registrationDate.split("T")[0]
                    : "",
                businessAddress: data.profile.businessAddress || "",
                city: data.profile.city || "",
                district: data.profile.district || "",
                state: data.profile.state || "",
                pinCode: data.profile.pinCode || "",
            });

            setBankForm({
                bankName: data.profile.bankDetails?.bankName || "",
                accountHolder: data.profile.bankDetails?.accountHolder || "",
                accountNumber: data.profile.bankDetails?.accountNumber || "",
                ifsc: data.profile.bankDetails?.ifsc || "",
            });

            setNotificationForm({
                orderUpdates: data.profile.notificationPreferences?.orderUpdates ?? true,
                paymentUpdates:
                    data.profile.notificationPreferences?.paymentUpdates ?? true,
                rewardUpdates:
                    data.profile.notificationPreferences?.rewardUpdates ?? true,
                promotionalCampaigns:
                    data.profile.notificationPreferences?.promotionalCampaigns ?? true,
            });

            if (data.profile.profilePicture) {
                setProfileImagePreview(
                    `${API_BASE_URL}${data.profile.profilePicture}`
                );
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;

        setProfileForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBankChange = (e) => {
        const { name, value } = e.target;

        setBankForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;

        setNotificationForm((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswordForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/api/dealer/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileForm),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            setProfile(data.profile);
            alert(data.message);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBankSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/dealer/profile/bank-details`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bankForm),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update bank details");
            }

            setProfile(data.profile);
            alert(data.message);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/dealer/profile/notification-preferences`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(notificationForm),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update notification preferences"
                );
            }

            setProfile(data.profile);
            alert(data.message);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await fetch(
                `${API_BASE_URL}/api/dealer/profile/change-password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(passwordForm),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to change password");
            }

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
            });

            alert(data.message);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setProfileImage(file);
        setProfileImagePreview(URL.createObjectURL(file));
    };

    const handleProfileImageUpload = async () => {
        if (!profileImage) {
            alert("Please select a profile picture");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("profilePicture", profileImage);

            const response = await fetch(
                `${API_BASE_URL}/api/dealer/profile/profile-picture`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to upload profile picture");
            }

            setProfile(data.profile);

            setProfileImagePreview(
                `${API_BASE_URL}${data.profilePicture}?t=${Date.now()}`
            );

            setProfileImage(null);

            alert(data.message);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getProfileImage = () => {
        if (profileImagePreview) {
            return profileImagePreview;
        }

        return "";
    };

    const getDealerProfileLink = () => {
        return `${window.location.origin}/dealer/profile/${profile?.dealer?._id || profile?.dealer}`;
    };

    const handleCopyProfileLink = async () => {
        try {
            await navigator.clipboard.writeText(getDealerProfileLink());
            alert("Profile link copied successfully");
        } catch (error) {
            alert("Failed to copy profile link");
        }
    };

    const handleWhatsAppShare = () => {
        const profileLink = getDealerProfileLink();

        const message = `Check out my dealer profile: ${profileLink}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    return (
        <div className="dealer-profile-page">
            <div className="dealer-profile-header">
                <div>
                    <h1>Profile Management</h1>
                    <p>Manage your dealer profile, bank details and settings</p>
                </div>
            </div>

            <div className="dealer-profile-image-card">
                <div className="dealer-profile-avatar">
                    {getProfileImage() ? (
                        <img src={getProfileImage()} alt="Dealer Profile" />
                    ) : (
                        <User size={42} />
                    )}

                    <label htmlFor="dealer-profile-picture" className="profile-camera">
                        <Camera size={17} />
                    </label>

                    <input
                        id="dealer-profile-picture"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleProfileImageChange}
                        hidden
                    />
                </div>

                <div className="profile-image-info">
                    <h3>{profileForm.dealerName || "Dealer Profile"}</h3>
                    <p>{profileForm.businessName || "Business Name"}</p>

                    {profileImage && (
                        <button
                            type="button"
                            className="profile-upload-btn"
                            onClick={handleProfileImageUpload}
                            disabled={loading}
                        >
                            <Upload size={16} />
                            Upload Picture
                        </button>
                    )}
                </div>
            </div>

            <section className="dealer-profile-section">
                <div className="section-title">
                    <User size={20} />
                    <div>
                        <h2>Profile Details</h2>
                        <p>Your personal and business information</p>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit}>
                    <div className="profile-form-grid">
                        <div className="profile-form-group">
                            <label>Dealer Name</label>
                            <input
                                type="text"
                                name="dealerName"
                                value={profileForm.dealerName}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Business Name</label>
                            <input
                                type="text"
                                name="businessName"
                                value={profileForm.businessName}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Mobile Number</label>
                            <input
                                type="text"
                                name="mobileNumber"
                                value={profileForm.mobileNumber}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>GST Number</label>
                            <input
                                type="text"
                                name="gstNumber"
                                value={profileForm.gstNumber}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>PAN Number</label>
                            <input
                                type="text"
                                name="panNumber"
                                value={profileForm.panNumber}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Shop Act Number</label>
                            <input
                                type="text"
                                name="shopActNumber"
                                value={profileForm.shopActNumber}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Registration Date</label>
                            <input
                                type="date"
                                name="registrationDate"
                                value={profileForm.registrationDate}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group profile-full-width">
                            <label>Business Address</label>
                            <textarea
                                name="businessAddress"
                                value={profileForm.businessAddress}
                                onChange={handleProfileChange}
                                rows="3"
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={profileForm.city}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>District</label>
                            <input
                                type="text"
                                name="district"
                                value={profileForm.district}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={profileForm.state}
                                onChange={handleProfileChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>PIN Code</label>
                            <input
                                type="text"
                                name="pinCode"
                                value={profileForm.pinCode}
                                onChange={handleProfileChange}
                            />
                        </div>
                    </div>

                    <button className="profile-save-btn" type="submit" disabled={loading}>
                        <Save size={17} />
                        Save Profile
                    </button>
                </form>
            </section>

            <section className="dealer-profile-section">
                <div className="section-title">
                    <Landmark size={20} />
                    <div>
                        <h2>Bank Details</h2>
                        <p>Manage your registered bank account details</p>
                    </div>
                </div>

                <form onSubmit={handleBankSubmit}>
                    <div className="profile-form-grid">
                        <div className="profile-form-group">
                            <label>Bank Name</label>
                            <input
                                type="text"
                                name="bankName"
                                value={bankForm.bankName}
                                onChange={handleBankChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Account Holder</label>
                            <input
                                type="text"
                                name="accountHolder"
                                value={bankForm.accountHolder}
                                onChange={handleBankChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>Account Number</label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={bankForm.accountNumber}
                                onChange={handleBankChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>IFSC</label>
                            <input
                                type="text"
                                name="ifsc"
                                value={bankForm.ifsc}
                                onChange={handleBankChange}
                            />
                        </div>
                    </div>

                    <button className="profile-save-btn" type="submit" disabled={loading}>
                        <Save size={17} />
                        Save Bank Details
                    </button>
                </form>
            </section>

            <section className="dealer-profile-section">
                <div className="section-title">
                    <Bell size={20} />
                    <div>
                        <h2>Notification Preferences</h2>
                        <p>Choose which notifications you want to receive</p>
                    </div>
                </div>

                <form onSubmit={handleNotificationSubmit}>
                    <div className="notification-list">
                        <label className="notification-item">
                            <div>
                                <strong>Order Updates</strong>
                                <span>Receive notifications about your orders</span>
                            </div>
                            <input
                                type="checkbox"
                                name="orderUpdates"
                                checked={notificationForm.orderUpdates}
                                onChange={handleNotificationChange}
                            />
                        </label>

                        <label className="notification-item">
                            <div>
                                <strong>Payment Updates</strong>
                                <span>Receive payment related notifications</span>
                            </div>
                            <input
                                type="checkbox"
                                name="paymentUpdates"
                                checked={notificationForm.paymentUpdates}
                                onChange={handleNotificationChange}
                            />
                        </label>

                        <label className="notification-item">
                            <div>
                                <strong>Reward Updates</strong>
                                <span>Receive reward and points notifications</span>
                            </div>
                            <input
                                type="checkbox"
                                name="rewardUpdates"
                                checked={notificationForm.rewardUpdates}
                                onChange={handleNotificationChange}
                            />
                        </label>

                        <label className="notification-item">
                            <div>
                                <strong>Promotional Campaigns</strong>
                                <span>Receive promotional campaign notifications</span>
                            </div>
                            <input
                                type="checkbox"
                                name="promotionalCampaigns"
                                checked={notificationForm.promotionalCampaigns}
                                onChange={handleNotificationChange}
                            />
                        </label>
                    </div>

                    <button className="profile-save-btn" type="submit" disabled={loading}>
                        <Save size={17} />
                        Save Preferences
                    </button>
                </form>
            </section>

            <section className="dealer-profile-section">
                <div className="section-title">
                    <Lock size={20} />
                    <div>
                        <h2>Change Password</h2>
                        <p>Update your dealer account password</p>
                    </div>
                </div>

                <form onSubmit={handlePasswordSubmit}>
                    <div className="profile-form-grid password-grid">
                        <div className="profile-form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div className="profile-form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>

                    <button className="profile-save-btn" type="submit" disabled={loading}>
                        <Lock size={17} />
                        Change Password
                    </button>
                </form>
            </section>

            <section className="dealer-profile-section share-profile-section">
                <div className="section-title">
                    <Share2 size={20} />
                    <div>
                        <h2>Share Dealer Profile</h2>
                        <p>Share your dealer profile with others</p>
                    </div>
                </div>

                <div className="shared-dealer-details">
                    <div className="shared-profile-image">
                        {profileImagePreview ? (
                            <img src={profileImagePreview} alt="Dealer Profile" />
                        ) : (
                            <User size={35} />
                        )}
                    </div>

                    <div className="shared-profile-info">
                        <h3>{profileForm.dealerName || "Dealer Name"}</h3>
                        <p>{profileForm.businessName || "Business Name"}</p>
                    </div>
                </div>

                <div className="share-profile-actions">
                    <button
                        type="button"
                        className="share-copy-btn"
                        onClick={handleCopyProfileLink}
                    >
                        <Copy size={17} />
                        Copy Link
                    </button>

                    <button
                        type="button"
                        className="share-whatsapp-btn"
                        onClick={handleWhatsAppShare}
                    >
                        <MessageCircle size={17} />
                        WhatsApp
                    </button>
                </div>
            </section>
        </div>
    );
};

export default DealerProfileManagement;