import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Clock3,
  Truck,
  IndianRupee,
  Wallet,
  Bell,
  Gift,
  Award,
  Tag,
  Package,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/dealer/DealerDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [purchaseAnalytics, setPurchaseAnalytics] = useState(null);
  const [rewardWallet, setRewardWallet] = useState(null);
  const [loyaltyTier, setLoyaltyTier] = useState(null);
  const [paymentOutstanding, setPaymentOutstanding] = useState(null);
  const [schemes, setSchemes] = useState([]);
  const [painterEnquiries, setPainterEnquiries] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          ordersResponse,
          analyticsResponse,
          rewardResponse,
          loyaltyResponse,
          paymentResponse,
          schemesResponse,
          enquiriesResponse,
          notificationsResponse,
        ] = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/dealer/orders`, { headers }),
          fetch(`${API_BASE_URL}/api/dealer/purchase-analytics`, { headers }),
          fetch(`${API_BASE_URL}/api/rewards/wallet/${getUserId()}`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/api/dealer/loyalty-tier`, { headers }),
          fetch(`${API_BASE_URL}/api/dealer/payment-outstanding`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/api/schemes?status=ACTIVE`, { headers }),
          fetch(`${API_BASE_URL}/api/dealer/painter-enquiries`, { headers }),
          fetch(`${API_BASE_URL}/api/notifications`, { headers }),
        ]);

        const readResponse = async (result) => {
          if (result.status !== "fulfilled") return null;

          try {
            return await result.value.json();
          } catch {
            return null;
          }
        };

        const ordersData = await readResponse(ordersResponse);
        const analyticsData = await readResponse(analyticsResponse);
        const rewardData = await readResponse(rewardResponse);
        const loyaltyData = await readResponse(loyaltyResponse);
        const paymentData = await readResponse(paymentResponse);
        const schemesData = await readResponse(schemesResponse);
        const enquiriesData = await readResponse(enquiriesResponse);
        const notificationsData = await readResponse(notificationsResponse);

        setOrders(
          ordersData?.orders ||
            ordersData?.data?.orders ||
            ordersData?.data ||
            []
        );

        setPurchaseAnalytics(
          analyticsData?.summary
            ? analyticsData
            : analyticsData?.data || null
        );

        setRewardWallet(
          rewardData?.wallet ||
            rewardData?.data?.wallet ||
            rewardData?.data ||
            null
        );

        setLoyaltyTier(
          loyaltyData?.data?.currentTier ||
            loyaltyData?.currentTier ||
            null
        );

        setPaymentOutstanding(
          paymentData?.summary ||
            paymentData?.data?.summary ||
            null
        );

        setSchemes(
          schemesData?.schemes ||
            schemesData?.data?.schemes ||
            schemesData?.data ||
            []
        );

        setPainterEnquiries(
          enquiriesData?.enquiries ||
            enquiriesData?.data?.enquiries ||
            enquiriesData?.data ||
            []
        );

        const dealerNotifications =
          notificationsData?.notifications ||
          notificationsData?.data?.notifications ||
          notificationsData?.data ||
          [];

        setNotifications(
          Array.isArray(dealerNotifications)
            ? dealerNotifications.filter(
                (notification) =>
                  notification.userType === "DEALERS" ||
                  notification.userType === "ALL_USERS"
              )
            : []
        );
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?._id || user?.id || "";
    } catch {
      return "";
    }
  };

  const getTodayOrders = () => {
    const today = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.date);

      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
  };

  const todayOrders = getTodayOrders();

  const todaySales = todayOrders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter((order) =>
    ["Submitted", "Under Review", "Approved", "Processing"].includes(
      order.status
    )
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalPurchase =
    purchaseAnalytics?.summary?.totalPurchase ||
    purchaseAnalytics?.totalPurchase ||
    0;

  const outstandingAmount =
    paymentOutstanding?.totalOutstanding ||
    0;

  const rewardPoints =
    rewardWallet?.points ||
    rewardWallet?.availablePoints ||
    rewardWallet?.currentPoints ||
    0;

  const cashRewards =
    rewardWallet?.cashAmount ||
    rewardWallet?.availableCash ||
    rewardWallet?.cashRewards ||
    0;

  const activeSchemes = schemes.filter(
    (scheme) =>
      scheme.status === "ACTIVE" ||
      !scheme.status
  ).length;

  const activeOffers = schemes.filter((scheme) =>
    ["CASHBACK", "REWARD", "DISCOUNT"].includes(scheme.schemeType)
  ).length;

  const pendingPainterEnquiries = painterEnquiries.filter(
    (enquiry) => enquiry.status === "PENDING"
  ).length;

  const tierName = loyaltyTier?.tierName || "Not Available";

  return (
    <div className="dealer-dashboard">
      <div className="dealer-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your Dealer Dashboard</p>
        </div>
      </div>

      <div className="dealer-dashboard-stats">
        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon">
            <IndianRupee size={22} />
          </div>
          <div>
            <span>Today's Sales</span>
            <h3>₹{todaySales.toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon">
            <ShoppingCart size={22} />
          </div>
          <div>
            <span>Today's Orders</span>
            <h3>{todayOrders.length}</h3>
          </div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon">
            <Clock3 size={22} />
          </div>
          <div>
            <span>Pending Orders</span>
            <h3>{pendingOrders}</h3>
          </div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon">
            <Truck size={22} />
          </div>
          <div>
            <span>Delivered Orders</span>
            <h3>{deliveredOrders}</h3>
          </div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon">
            <Wallet size={22} />
          </div>
          <div>
            <span>Total Purchase Value</span>
            <h3>₹{Number(totalPurchase).toLocaleString("en-IN")}</h3>
          </div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon">
            <IndianRupee size={22} />
          </div>
          <div>
            <span>Outstanding Amount</span>
            <h3>
              ₹{Number(outstandingAmount).toLocaleString("en-IN")}
            </h3>
          </div>
        </div>
      </div>

      <div className="dealer-dashboard-grid">
        <div className="dealer-dashboard-section">
          <div className="dealer-dashboard-section-header">
            <h2>Rewards & Loyalty</h2>
          </div>

          <div className="dealer-dashboard-mini-grid">
            <div className="dealer-dashboard-mini-card">
              <Gift size={20} />
              <span>Available Reward Points</span>
              <strong>{rewardPoints}</strong>
            </div>

            <div className="dealer-dashboard-mini-card">
              <IndianRupee size={20} />
              <span>Available Cash Rewards</span>
              <strong>
                ₹{Number(cashRewards).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="dealer-dashboard-mini-card">
              <Award size={20} />
              <span>Loyalty Tier</span>
              <strong>{tierName}</strong>
            </div>
          </div>
        </div>

        <div className="dealer-dashboard-section">
          <div className="dealer-dashboard-section-header">
            <h2>Schemes & Offers</h2>
          </div>

          <div className="dealer-dashboard-mini-grid">
            <div className="dealer-dashboard-mini-card">
              <Tag size={20} />
              <span>Active Schemes</span>
              <strong>{activeSchemes}</strong>
            </div>

            <div className="dealer-dashboard-mini-card">
              <Tag size={20} />
              <span>Active Offers</span>
              <strong>{activeOffers}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="dealer-dashboard-grid">
        <div className="dealer-dashboard-section">
          <div className="dealer-dashboard-section-header">
            <h2>Product Highlights</h2>
          </div>

          <div className="dealer-dashboard-empty">
            <Package size={28} />

            <p>
              {purchaseAnalytics?.productWisePurchase?.length
                ? `${purchaseAnalytics.productWisePurchase.length} products purchased`
                : "No product highlights available"}
            </p>

            <button
              type="button"
              onClick={() => navigate("/dealer/product-catalogue")}
            >
              View Products
            </button>
          </div>
        </div>

        <div className="dealer-dashboard-section">
          <div className="dealer-dashboard-section-header">
            <h2>Painter Enquiries</h2>
          </div>

          <div className="dealer-dashboard-empty">
            <Users size={28} />
            <p>Pending Painter Enquiries: {pendingPainterEnquiries}</p>

            <button
              type="button"
              onClick={() => navigate("/dealer/painter-enquiries")}
            >
              View Enquiries
            </button>
          </div>
        </div>
      </div>

      <div className="dealer-dashboard-grid">
        <div className="dealer-dashboard-section">
          <div className="dealer-dashboard-section-header">
            <h2>Payment Reminder</h2>
          </div>

          <div className="dealer-dashboard-empty">
            <Bell size={28} />

            <p>
              {outstandingAmount > 0
                ? `Outstanding Amount: ₹${Number(
                    outstandingAmount
                  ).toLocaleString("en-IN")}`
                : "No payment reminders"}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/dealer/payment-outstanding")
              }
            >
              View Payment Details
            </button>
          </div>
        </div>

        <div className="dealer-dashboard-section">
          <div className="dealer-dashboard-section-header">
            <h2>Notifications</h2>
          </div>

          <div className="dealer-dashboard-empty">
            <Bell size={28} />

            <p>
              {notifications.length > 0
                ? `${notifications.length} notification${
                    notifications.length > 1 ? "s" : ""
                  } available`
                : "No new notifications"}
            </p>

            <button
              type="button"
              onClick={() => navigate("/dealer/notifications")}
            >
              View Notifications
            </button>
          </div>
        </div>
      </div>

      <div className="dealer-dashboard-quick-actions">
        <h2>Quick Actions</h2>

        <div className="dealer-dashboard-action-grid">
          <button
            type="button"
            onClick={() => navigate("/dealer/product-ordering")}
          >
            <Zap size={20} />
            Quick Order
          </button>

          <button
            type="button"
            onClick={() => navigate("/dealer/reward-wallet")}
          >
            <Gift size={20} />
            Rewards
          </button>

          <button
            type="button"
            onClick={() => navigate("/dealer/schemes")}
          >
            <Tag size={20} />
            Schemes & Offers
          </button>

          <button
            type="button"
            onClick={() => navigate("/dealer/complaints")}
          >
            <Bell size={20} />
            Raise Complaint
          </button>
        </div>
      </div>

      {loading && (
        <div className="dealer-dashboard-loading">
          Loading dashboard...
        </div>
      )}
    </div>
  );
};

export default DealerDashboard;