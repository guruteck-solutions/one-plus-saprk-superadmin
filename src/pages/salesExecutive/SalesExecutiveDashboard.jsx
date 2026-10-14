
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  MapPin,
  Target,
  TrendingUp,
  Wallet,
  ShoppingCart,
  UserPlus,
  Store,
  Paintbrush,
  MessageSquareWarning,
  Bell,
  Plus,
  ClipboardList,
  Users,
  Receipt,
  AlertCircle,
  MapPinCheck,
} from "lucide-react";
import "../../css/salesExecutive/SalesExecutiveDashboard.css";
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const SalesExecutiveDashboard = () => {

  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        if (!API_BASE_URL) {
          throw new Error(
            "VITE_API_URL missing hai. Frontend .env file check karo."
          );
        }

        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("accessToken");

        const apiUrl = `${API_BASE_URL}/api/sales-executive/dashboard`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        const contentType = response.headers.get("content-type") || "";
        const responseText = await response.text();

        if (!contentType.includes("application/json")) {
          console.error(
            "Dashboard API returned non-JSON response:",
            responseText.slice(0, 300)
          );

          throw new Error(
            `API se JSON ke bajay HTML/text aaya. URL: ${apiUrl}. Backend port aur server.js route mount check karo.`
          );
        }

        let result;

        try {
          result = JSON.parse(responseText);
        } catch {
          throw new Error("Dashboard API ka JSON response invalid hai.");
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || `Dashboard API failed (${response.status}).`
          );
        }

        setDashboardData(result.dashboard);
      } catch (err) {
        console.error("Dashboard API error:", err);
        setError(err.message || "Dashboard data load nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const formatCurrency = (value) =>
    value == null
      ? "—"
      : `₹${Number(value).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
      })}`;

  const dashboardWidgets = [
    {
      title: "Today's Sales",
      value: formatCurrency(dashboardData?.todaySales),
      icon: IndianRupee,
    },
    {
      title: "Today's Visits",
      value: dashboardData?.todayVisits ?? "—",
      icon: MapPin,
    },
    {
      title: "Monthly Target",
      value: formatCurrency(dashboardData?.monthlyTarget),
      icon: Target,
    },
    {
      title: "Achievement",
      value:
        dashboardData?.achievement == null
          ? "—"
          : `${dashboardData.achievement}%`,
      icon: TrendingUp,
    },
    {
      title: "Pending Collections",
      value: formatCurrency(dashboardData?.pendingCollections),
      icon: Wallet,
    },
    {
      title: "Pending Orders",
      value: dashboardData?.pendingOrders ?? "—",
      icon: ShoppingCart,
    },
    {
      title: "Today's Leads",
      value: dashboardData?.todayLeads ?? "—",
      icon: UserPlus,
    },
    {
      title: "Dealer Registrations",
      value: dashboardData?.dealerRegistrations ?? "—",
      icon: Store,
    },
    {
      title: "Painter Registrations",
      value: dashboardData?.painterRegistrations ?? "—",
      icon: Paintbrush,
    },
    {
      title: "Complaints Pending",
      value: dashboardData?.complaintsPending ?? "—",
      icon: MessageSquareWarning,
    },
    {
      title: "Notifications",
      value: dashboardData?.notifications ?? "—",
      icon: Bell,
    },
  ];

  const quickActions = [
  { title: "Check-In", icon: MapPinCheck, path: "/sales-executive/attendance" },
  { title: "Add Lead", icon: Plus, path: "/sales-executive/leads" },
  { title: "Book Order", icon: ClipboardList, path: "/sales-executive/order-booking" },
  { title: "Register Dealer", icon: Store, path: "/sales-executive/dealer-registration" },
  { title: "Register Painter", icon: Users, path: "/sales-executive/painter-registration" },
  { title: "Collection Entry", icon: Receipt, path: "/sales-executive/collection-management" },
  { title: "Complaint Registration", icon: AlertCircle, path: "/sales-executive/complaint-management" },
];

  return (
    <div className="sales-executive-dashboard">
      <div className="sales-executive-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Sales Executive Overview</p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          style={{
            color: "#dc2626",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            overflowWrap: "anywhere",
          }}
        >
          {error}
        </p>
      )}

      <div className="sales-executive-dashboard-widgets">
        {dashboardWidgets.map((widget) => {
          const Icon = widget.icon;

          return (
            <div
              className="sales-executive-dashboard-card"
              key={widget.title}
            >
              <div className="sales-executive-dashboard-card-icon">
                <Icon size={22} />
              </div>

              <div className="sales-executive-dashboard-card-content">
                <span>{widget.title}</span>
                <strong>{loading ? "..." : widget.value}</strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sales-executive-quick-actions">
        <div className="sales-executive-section-header">
          <h2>Quick Actions</h2>
        </div>

        <div className="sales-executive-quick-actions-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                type="button"
                className="sales-executive-quick-action"
                key={action.title}
                 onClick={() => navigate(action.path)}
              >
                <Icon size={21} />
                <span>{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesExecutiveDashboard;
