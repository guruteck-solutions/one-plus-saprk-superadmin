import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Package, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/dealer/DealerOrderHistory.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerOrderHistory = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/dealer/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Fetch dealer orders error:", error);
      setError(
        error.response?.data?.message || "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      order.orderId?.toLowerCase().includes(searchValue);

    const matchesStatus =
      !status || order.status === status;

    return matchesSearch && matchesStatus;
  });

  const currentOrders = filteredOrders.filter(
    (order) =>
      !["Delivered", "Cancelled"].includes(order.status)
  );

  const previousOrders = filteredOrders.filter(
    (order) =>
      ["Delivered", "Cancelled"].includes(order.status)
  );

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (orderStatus) => {
    return orderStatus
      ?.toLowerCase()
      .replace(/\s+/g, "-");
  };

  const renderOrderTable = (orderList) => {
    if (orderList.length === 0) {
      return (
        <div className="dealer-order-history-empty">
          <Package size={32} />
          <p>No orders found</p>
        </div>
      );
    }

    return (
      <div className="dealer-order-history-table-wrapper">
        <table className="dealer-order-history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orderList.map((order) => (
              <tr key={order._id}>
                <td>
                  <strong>{order.orderId}</strong>
                </td>

                <td>{formatDate(order.createdAt)}</td>

                <td>{order.items?.length || 0}</td>

                <td>₹{order.totalAmount}</td>

                <td>
                  <span
                    className={`dealer-order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className="dealer-order-view-btn"
                    onClick={() =>
                      navigate(
                        `/dealer/order-history/${order._id}`
                      )
                    }
                  >
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="dealer-order-history">
      <div className="dealer-order-history-header">
        <div>
          <h1>Order History & Tracking</h1>
          <p>View your current and previous orders</p>
        </div>
      </div>

      <div className="dealer-order-history-filter">
        <div className="dealer-order-history-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Processing">Processing</option>
          <option value="Dispatched">Dispatched</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="dealer-order-history-message">
          Loading orders...
        </div>
      ) : error ? (
        <div className="dealer-order-history-message dealer-order-history-error">
          {error}
        </div>
      ) : (
        <>
          <section className="dealer-order-history-section">
            <div className="dealer-order-history-section-header">
              <h2>Current Orders</h2>
              <span>{currentOrders.length}</span>
            </div>

            {renderOrderTable(currentOrders)}
          </section>

          <section className="dealer-order-history-section">
            <div className="dealer-order-history-section-header">
              <h2>Previous Orders</h2>
              <span>{previousOrders.length}</span>
            </div>

            {renderOrderTable(previousOrders)}
          </section>
        </>
      )}
    </div>
  );
};

export default DealerOrderHistory;