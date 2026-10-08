import React from "react";
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

const SalesExecutiveDashboard = () => {
  const dashboardWidgets = [
    {
      title: "Today's Sales",
      value: "₹0",
      icon: IndianRupee,
    },
    {
      title: "Today's Visits",
      value: "0",
      icon: MapPin,
    },
    {
      title: "Monthly Target",
      value: "₹0",
      icon: Target,
    },
    {
      title: "Achievement",
      value: "0%",
      icon: TrendingUp,
    },
    {
      title: "Pending Collections",
      value: "₹0",
      icon: Wallet,
    },
    {
      title: "Pending Orders",
      value: "0",
      icon: ShoppingCart,
    },
    {
      title: "Today's Leads",
      value: "0",
      icon: UserPlus,
    },
    {
      title: "Dealer Registrations",
      value: "0",
      icon: Store,
    },
    {
      title: "Painter Registrations",
      value: "0",
      icon: Paintbrush,
    },
    {
      title: "Complaints Pending",
      value: "0",
      icon: MessageSquareWarning,
    },
    {
      title: "Notifications",
      value: "0",
      icon: Bell,
    },
  ];

  const quickActions = [
    {
      title: "Check-In",
      icon: MapPinCheck,
    },
    {
      title: "Add Lead",
      icon: Plus,
    },
    {
      title: "Book Order",
      icon: ClipboardList,
    },
    {
      title: "Register Dealer",
      icon: Store,
    },
    {
      title: "Register Painter",
      icon: Users,
    },
    {
      title: "Collection Entry",
      icon: Receipt,
    },
    {
      title: "Complaint Registration",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="sales-executive-dashboard">
      <div className="sales-executive-dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Sales Executive Overview</p>
        </div>
      </div>

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
                <strong>{widget.value}</strong>
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