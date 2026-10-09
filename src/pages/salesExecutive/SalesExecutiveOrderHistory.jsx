import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Eye, XCircle, Send, ChevronDown } from "lucide-react";
import "../../css/salesExecutive/SalesExecutiveOrderHistory.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "";

const ORDER_STATUSES = [
    "Draft",
    "Submitted",
    "Approved",
    "Processing",
    "Dispatched",
    "Delivered",
    "Cancelled",
];

const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    "";

const authConfig = () => {
    const token = getToken();
    return {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
};

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
};

const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);

const getOrderId = (order) => order.orderId || order._id || "—";
const getDealerName = (order) =>
    order.dealer?.name ||
    order.dealer?.fullName ||
    order.dealer?.businessName ||
    order.dealerName ||
    "Dealer";

export default function SalesExecutiveOrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [busyOrderId, setBusyOrderId] = useState("");
    const [notice, setNotice] = useState({ type: "", text: "" });

    const loadOrders = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);
        setError("");
        try {
            const response = await fetch(`${API_BASE_URL}/api/sales-executive/orders`, {
                ...authConfig(),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || data.error || `Unable to load orders (${response.status})`);
            }
            const list = Array.isArray(data) ? data : data.orders || data.data || [];
            setOrders(list);
        } catch (err) {
            setError(err.message || "Something went wrong while loading order history.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const filteredOrders = useMemo(() => {
        const term = search.trim().toLowerCase();
        return orders.filter((order) => {
            const matchesStatus = statusFilter === "All" || order.status === statusFilter;
            const searchable = [
                getOrderId(order),
                getDealerName(order),
                order.dealer?.phone,
                order.dealer?.mobile,
                order.status,
                ...(order.items || []).map((item) => item.productName || item.product?.productName || ""),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();
            return matchesStatus && (!term || searchable.includes(term));
        });
    }, [orders, search, statusFilter]);

    const updateStatus = async (order, status) => {
        const id = order._id;
        if (!id) return;
        const confirmation =
            status === "Cancelled"
                ? "Are you sure you want to cancel this submitted order?"
                : "Submit this draft order?";
        if (!window.confirm(confirmation)) return;

        setBusyOrderId(id);
        setNotice({ type: "", text: "" });
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/sales-executive/orders/${id}/status`,
                {
                    method: "PATCH",
                    ...authConfig(),
                    headers: {
                        ...authConfig().headers,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || data.error || "Unable to update order status.");
            }
            setNotice({ type: "success", text: data.message || `Order ${status.toLowerCase()} successfully.` });
            await loadOrders(true);
            setSelectedOrder((current) =>
                current && current._id === id ? { ...current, status } : current
            );
        } catch (err) {
            setNotice({ type: "error", text: err.message || "Status update failed." });
        } finally {
            setBusyOrderId("");
        }
    };

    const statusClass = (status) =>
        `seh-status seh-status-${String(status || "unknown").toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <main className="seh-page">
            <header className="seh-header">
                <div>
                
                    <h1>Order History</h1>
                    <p className="seh-subtitle">View and manage the orders created from your account.</p>
                </div>
                <button
                    type="button"
                    className="seh-refresh-btn"
                    onClick={() => loadOrders(true)}
                    disabled={refreshing || loading}
                >
                    <RefreshCw size={16} className={refreshing ? "seh-spin" : ""} />
                    <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                </button>
            </header>

            {notice.text && (
                <div className={`seh-notice seh-notice-${notice.type}`} role="status">
                    <span>{notice.text}</span>
                    <button type="button" aria-label="Dismiss message" onClick={() => setNotice({ type: "", text: "" })}>
                        <XCircle size={17} />
                    </button>
                </div>
            )}

            <section className="seh-summary-grid" aria-label="Order summary">
                <div className="seh-summary-card">
                    <span>Total Orders</span>
                    <strong>{orders.length}</strong>
                </div>
                <div className="seh-summary-card">
                    <span>Draft</span>
                    <strong>{orders.filter((order) => order.status === "Draft").length}</strong>
                </div>
                <div className="seh-summary-card">
                    <span>Submitted</span>
                    <strong>{orders.filter((order) => order.status === "Submitted").length}</strong>
                </div>
                <div className="seh-summary-card">
                    <span>Completed</span>
                    <strong>{orders.filter((order) => order.status === "Delivered").length}</strong>
                </div>
            </section>

            <section className="seh-panel">
                <div className="seh-toolbar">
                    <label className="seh-search">
                        <Search size={18} />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search order, dealer or product..."
                            aria-label="Search orders"
                        />
                    </label>
                    <label className="seh-filter">
                        <span>Status</span>
                        <span className="seh-select-wrap">
                            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                                <option value="All">All statuses</option>
                                {ORDER_STATUSES.map((status) => (
                                    <option value={status} key={status}>{status}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} />
                        </span>
                    </label>
                </div>

                {error && (
                    <div className="seh-error">
                        <p>{error}</p>
                        <button type="button" onClick={() => loadOrders()}>Try again</button>
                    </div>
                )}

                {loading ? (
                    <div className="seh-state">Loading order history...</div>
                ) : !error && filteredOrders.length === 0 ? (
                    <div className="seh-empty">
                        <div className="seh-empty-icon"><Search size={22} /></div>
                        <h3>No orders found</h3>
                        <p>{orders.length ? "Try changing your search or status filter." : "Orders you create will appear here."}</p>
                    </div>
                ) : !error ? (
                    <>
                        <div className="seh-table-wrap">
                            <table className="seh-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Dealer</th>
                                        <th>Order Date</th>
                                        <th>Items</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                        <th className="seh-actions-heading">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => (
                                        <tr key={order._id || order.orderId}>
                                            <td data-label="Order ID"><span className="seh-order-id">{getOrderId(order)}</span></td>
                                            <td data-label="Dealer">
                                                <div className="seh-dealer-name">{getDealerName(order)}</div>
                                                {(order.dealer?.phone || order.dealer?.mobile) && (
                                                    <small className="seh-muted">{order.dealer.phone || order.dealer.mobile}</small>
                                                )}
                                            </td>
                                            <td data-label="Order Date">{formatDate(order.createdAt)}</td>
                                            <td data-label="Items">{(order.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)}</td>
                                            <td data-label="Total Amount" className="seh-amount">{formatCurrency(order.totalAmount)}</td>
                                            <td data-label="Status"><span className={statusClass(order.status)}>{order.status || "Unknown"}</span></td>
                                            <td data-label="Actions">
                                                <div className="seh-row-actions">
                                                    <button type="button" className="seh-icon-btn" title="View order details" aria-label="View order details" onClick={() => setSelectedOrder(order)}>
                                                        <Eye size={17} />
                                                    </button>
                                                    {order.status === "Draft" && (
                                                        <button
                                                            type="button"
                                                            className="seh-action-btn seh-submit-btn"
                                                            disabled={busyOrderId === order._id}
                                                            onClick={() => updateStatus(order, "Submitted")}
                                                        >
                                                            <Send size={14} /> Submit
                                                        </button>
                                                    )}
                                                    {order.status === "Submitted" && (
                                                        <button
                                                            type="button"
                                                            className="seh-action-btn seh-cancel-btn"
                                                            disabled={busyOrderId === order._id}
                                                            onClick={() => updateStatus(order, "Cancelled")}
                                                        >
                                                            <XCircle size={14} /> Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="seh-results-count">Showing {filteredOrders.length} of {orders.length} orders</div>
                    </>
                ) : null}
            </section>

            {selectedOrder && (
                <div className="seh-modal-backdrop" role="presentation" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) setSelectedOrder(null);
                }}>
                    <section className="seh-modal" role="dialog" aria-modal="true" aria-labelledby="seh-modal-title">
                        <div className="seh-modal-header">
                            <div>
                                <p className="seh-eyebrow">ORDER DETAILS</p>
                                <h2 id="seh-modal-title">{getOrderId(selectedOrder)}</h2>
                            </div>
                            <button type="button" className="seh-modal-close" aria-label="Close details" onClick={() => setSelectedOrder(null)}>
                                <XCircle size={21} />
                            </button>
                        </div>
                        <div className="seh-modal-meta">
                            <div><span>Dealer</span><strong>{getDealerName(selectedOrder)}</strong></div>
                            <div><span>Date</span><strong>{formatDate(selectedOrder.createdAt)}</strong></div>
                            <div><span>Status</span><strong><span className={statusClass(selectedOrder.status)}>{selectedOrder.status}</span></strong></div>
                            <div><span>Total</span><strong>{formatCurrency(selectedOrder.totalAmount)}</strong></div>
                        </div>
                        <h3 className="seh-items-title">Products</h3>
                        <div className="seh-detail-items">
                            {(selectedOrder.items || []).map((item, index) => (
                                <div className="seh-detail-item" key={item._id || `${item.productName}-${index}`}>
                                    <div>
                                        <strong>{item.productName || item.product?.productName || "Product"}</strong>
                                        <span>{item.sku || item.product?.sku || "No SKU"} · Qty: {item.quantity} {item.unit || ""}</span>
                                    </div>
                                    <strong>{formatCurrency(item.lineTotal ?? (Number(item.quantity) * Number(item.unitPrice)))}</strong>
                                </div>
                            ))}
                            {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                                <p className="seh-muted">No product details available.</p>
                            )}
                        </div>
                        {selectedOrder.remarks && (
                            <div className="seh-remarks"><span>Remarks</span><p>{selectedOrder.remarks}</p></div>
                        )}
                        <div className="seh-modal-footer">
                            <button type="button" className="seh-close-btn" onClick={() => setSelectedOrder(null)}>Close</button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
}
