import React from "react";
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
import "../../css/dealer/DealerDashboard.css";
import { useNavigate } from "react-router-dom";

const DealerDashboard = () => {
  const navigate = useNavigate();
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
          <div className="dealer-dashboard-card-icon"><IndianRupee size={22} /></div>
          <div><span>Today's Sales</span><h3>₹0</h3></div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon"><ShoppingCart size={22} /></div>
          <div><span>Today's Orders</span><h3>0</h3></div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon"><Clock3 size={22} /></div>
          <div><span>Pending Orders</span><h3>0</h3></div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon"><Truck size={22} /></div>
          <div><span>Delivered Orders</span><h3>0</h3></div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon"><Wallet size={22} /></div>
          <div><span>Total Purchase Value</span><h3>₹0</h3></div>
        </div>

        <div className="dealer-dashboard-card">
          <div className="dealer-dashboard-card-icon"><IndianRupee size={22} /></div>
          <div><span>Outstanding Amount</span><h3>₹0</h3></div>
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
              <strong>0</strong>
            </div>

            <div className="dealer-dashboard-mini-card">
              <IndianRupee size={20} />
              <span>Available Cash Rewards</span>
              <strong>₹0</strong>
            </div>

            <div className="dealer-dashboard-mini-card">
              <Award size={20} />
              <span>Loyalty Tier</span>
              <strong>Basic</strong>
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
              <strong>0</strong>
            </div>

            <div className="dealer-dashboard-mini-card">
              <Tag size={20} />
              <span>Active Offers</span>
              <strong>0</strong>
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
            <p>No product highlights available</p>
          </div>
        </div>

        <div className="dealer-dashboard-section">
          <div className="dealer-dashboard-section-header">
            <h2>Painter Enquiries</h2>
          </div>

          <div className="dealer-dashboard-empty">
            <Users size={28} />
            <p>Pending Painter Enquiries: 0</p>
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
            <p>No payment reminders</p>
          </div>
        </div>

        <div className="dealer-dashboard-section">
          <div className="dealer-dashboard-section-header">
            <h2>Notifications</h2>
          </div>

          <div className="dealer-dashboard-empty">
            <Bell size={28} />
            <p>No new notifications</p>
          </div>
        </div>
      </div>

      <div className="dealer-dashboard-quick-actions">
        <h2>Quick Actions</h2>

        <div className="dealer-dashboard-action-grid">
          <button type="button" onClick={() => navigate("/dealer/product-ordering")}>
            <Zap size={20} />
            Quick Order
          </button>

          <button type="button">
            <Gift size={20} />
            Quick Rewards
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;