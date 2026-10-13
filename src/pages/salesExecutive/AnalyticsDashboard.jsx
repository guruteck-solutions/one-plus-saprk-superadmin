
import React, { useEffect, useState } from "react";
import {
    IndianRupee,
    TrendingUp,
    Target,
    Users,
    UserPlus,
    ShoppingCart,
    Wallet,
    CreditCard,
    UserCheck,
    ClipboardList,
    MapPinned,
    Package,
    AlertCircle,
    CalendarDays,
    ArrowUpRight,
} from "lucide-react";
import "../../css/salesExecutive/AnalyticsDashboard.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const AnalyticsDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [targetData, setTargetData] = useState(null);
    const [visits, setVisits] = useState([]);
    const [orders, setOrders] = useState([]);
    const [leads, setLeads] = useState([]);
    const [dealerRegistrations, setDealerRegistrations] = useState([]);
    const [painterRegistrations, setPainterRegistrations] = useState([]);
    const [collections, setCollections] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError("");

                if (!API_BASE_URL) {
                    throw new Error("VITE_API_URL missing hai. Frontend .env check karo.");
                }

                const token =
                    localStorage.getItem("token") ||
                    localStorage.getItem("authToken") ||
                    localStorage.getItem("accessToken");

                const headers = {
                    Accept: "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                };

                const fetchJSON = async (path) => {
                    const response = await fetch(`${API_BASE_URL}${path}`, {
                        method: "GET",
                        headers,
                    });

                    const contentType = response.headers.get("content-type") || "";
                    const text = await response.text();

                    if (!contentType.includes("application/json")) {
                        throw new Error(`Non-JSON response from ${path}`);
                    }

                    const result = JSON.parse(text);

                    if (!response.ok || result.success === false) {
                        throw new Error(result.message || `Request failed: ${path}`);
                    }

                    return result;
                };

                const requests = [
                    fetchJSON("/api/sales-executive/dashboard"),
                    fetchJSON("/api/sales-executive/targets/dashboard"),
                    fetchJSON("/api/sales-visits"),
                    fetchJSON("/api/sales-executive/orders"),
                    fetchJSON("/api/sales-executive/leads"),
                    fetchJSON("/api/sales-executive/dealer-registrations"),
                    fetchJSON("/api/sales-executive/painter-registrations"),
                    fetchJSON("/api/sales-executive/collections"),
                    fetchJSON("/api/sales-executive/complaints"),
                ];

                const results = await Promise.allSettled(requests);

                const getResult = (index) =>
                    results[index].status === "fulfilled"
                        ? results[index].value
                        : null;

                results.forEach((result) => {
                    if (result.status === "rejected") {
                        console.error("Analytics API error:", result.reason);
                    }
                });

                const dashboardResult = getResult(0);
                const targetResult = getResult(1);
                const visitsResult = getResult(2);
                const ordersResult = getResult(3);
                const leadsResult = getResult(4);
                const dealerResult = getResult(5);
                const painterResult = getResult(6);
                const collectionsResult = getResult(7);
                const complaintsResult = getResult(8);

                setDashboardData(dashboardResult?.dashboard || null);
                setTargetData(targetResult || null);
                setVisits(
                    visitsResult?.visits ||
                    visitsResult?.data ||
                    []
                );
                setOrders(
                    ordersResult?.orders ||
                    ordersResult?.data ||
                    []
                );
                setLeads(
                    leadsResult?.leads ||
                    leadsResult?.data ||
                    []
                );
                setDealerRegistrations(
                    dealerResult?.registrations ||
                    dealerResult?.data ||
                    []
                );
                setPainterRegistrations(
                    painterResult?.registrations ||
                    painterResult?.data ||
                    []
                );
                setCollections(
                    collectionsResult?.collections ||
                    collectionsResult?.data ||
                    []
                );
                setComplaints(
                    complaintsResult?.complaints ||
                    complaintsResult?.data ||
                    []
                );

                if (results.every((result) => result.status === "rejected")) {
                    setError("Analytics data load nahi hua. Backend routes aur server check karo.");
                }
            } catch (err) {
                console.error("Analytics dashboard error:", err);
                setError(err.message || "Analytics data load nahi ho paya.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const isToday = (date) => {
        if (!date) return false;
        const parsed = new Date(date);
        return parsed >= todayStart && parsed < tomorrowStart;
    };

    const isThisMonth = (date) => {
        if (!date) return false;
        const parsed = new Date(date);
        return parsed >= monthStart && parsed < nextMonthStart;
    };

    const formatCurrency = (value) =>
        value == null
            ? "—"
            : `₹${Number(value).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
            })}`;

    const monthlyTarget = targetData?.dashboard?.find(
        (item) => item.periodType === "MONTHLY"
    );

    const todayOrders = orders.filter((order) => isToday(order.createdAt));
    const monthlyOrders = orders.filter((order) => isThisMonth(order.createdAt));

    const deliveredToday = todayOrders.filter(
        (order) => order.status === "Delivered"
    );

    const deliveredThisMonth = monthlyOrders.filter(
        (order) => order.status === "Delivered"
    );

    const getOrderAmount = (order) =>
        Number(order.totalAmount ?? order.grandTotal ?? order.total ?? 0);

    const todaySales = dashboardData?.todaySales ??
        deliveredToday.reduce((sum, order) => sum + getOrderAmount(order), 0);

    const monthlySales = monthlyTarget?.achievedAmount ??
        deliveredThisMonth.reduce((sum, order) => sum + getOrderAmount(order), 0);

    const targetAmount = monthlyTarget?.targetAmount ??
        dashboardData?.monthlyTarget;

    const achievement = monthlyTarget?.achievementPercent ??
        (Number(targetAmount) > 0
            ? Number(((Number(monthlySales) / Number(targetAmount)) * 100).toFixed(1))
            : null);

    const todayVisits = visits.filter((visit) => isToday(visit.visitDate));
    const dealerVisits = todayVisits.filter(
        (visit) => String(visit.visitType || "").toUpperCase().includes("DEALER")
    ).length;
    const painterVisits = todayVisits.filter(
        (visit) => String(visit.visitType || "").toUpperCase().includes("PAINTER")
    ).length;

    const activeLeads = leads.filter((lead) =>
        !["CONVERTED", "LOST"].includes(String(lead.status || "").toUpperCase())
    ).length;

    const convertedLeads = leads.filter(
        (lead) => String(lead.status || "").toUpperCase() === "CONVERTED"
    ).length;

    const leadConversionRate = leads.length
        ? `${((convertedLeads / leads.length) * 100).toFixed(1)}%`
        : "0%";

    const outstandingAmount = collections.reduce((sum, collection) => {
        const status = String(collection.status || "").toUpperCase();
        if (["VERIFIED", "REJECTED"].includes(status)) return sum;

        return sum + Number(
            collection.outstandingAmount ??
            collection.pendingAmount ??
            collection.amount ??
            0
        );
    }, 0);

    const pendingComplaints = complaints.filter((complaint) =>
        ["NEW", "ASSIGNED", "UNDER_REVIEW"].includes(
            String(complaint.status || "").toUpperCase()
        )
    ).length;

    const salesMetrics = [
        {
            title: "Today's Sales",
            value: formatCurrency(todaySales),
            subtitle: "Delivered orders created today",
            icon: IndianRupee,
        },
        {
            title: "Monthly Sales",
            value: formatCurrency(monthlySales),
            subtitle: "Delivered sales this month",
            icon: TrendingUp,
        },
        {
            title: "Sales vs Target",
            value: achievement == null ? "—" : `${achievement}%`,
            subtitle: `Target: ${formatCurrency(targetAmount)}`,
            icon: Target,
        },
        {
            title: "Orders Booked",
            value: loading ? "..." : orders.length,
            subtitle: "Orders available to your account",
            icon: ShoppingCart,
        },
    ];

    const activityMetrics = [
        { title: "Dealer Visits", value: dealerVisits, icon: Users },
        { title: "Painter Visits", value: painterVisits, icon: UserCheck },
        { title: "New Dealer Registrations", value: dealerRegistrations.filter((item) => isThisMonth(item.createdAt)).length, icon: UserPlus },
        { title: "New Painter Registrations", value: painterRegistrations.filter((item) => isThisMonth(item.createdAt)).length, icon: UserPlus },
        { title: "Lead Conversion Rate", value: leadConversionRate, icon: TrendingUp },
        { title: "Active Leads", value: activeLeads, icon: ClipboardList },
    ];

    const financeMetrics = [
        {
            title: "Collection Performance",
            value: collections.length,
            icon: Wallet,
            description: "Collection entries recorded",
        },
        {
            title: "Outstanding Amount",
            value: formatCurrency(outstandingAmount),
            icon: CreditCard,
            description: "Estimated pending collection amount",
        },
        {
            title: "Pending Complaints",
            value: pendingComplaints,
            icon: AlertCircle,
            description: "Complaints awaiting resolution",
        },
    ];

    return (
        <div className="analytics-dashboard">
            <div className="ad-header">
                <div className="ad-header-content">
                    <span className="ad-eyebrow">SALES EXECUTIVE</span>
                    <h1>Analytics Dashboard</h1>
                    <p>Monitor sales, visits, registrations and business performance.</p>
                </div>

                <div className="ad-date-badge">
                    <CalendarDays size={17} />
                    <span>
                        {today.toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
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

            <section className="ad-section">
                <div className="ad-section-heading">
                    <div>
                        <h2>Sales Overview</h2>
                        <p>Your sales and order performance</p>
                    </div>
                </div>

                <div className="ad-metric-grid ad-sales-grid">
                    {salesMetrics.map((metric) => {
                        const Icon = metric.icon;

                        return (
                            <article className="ad-metric-card" key={metric.title}>
                                <div className="ad-metric-top">
                                    <div className="ad-icon-box">
                                        <Icon size={21} />
                                    </div>
                                    <ArrowUpRight size={17} className="ad-muted-icon" />
                                </div>
                                <p className="ad-metric-title">{metric.title}</p>
                                <h3 className="ad-metric-value">
                                    {loading ? "..." : metric.value}
                                </h3>
                                <span className="ad-metric-subtitle">{metric.subtitle}</span>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="ad-section">
                <div className="ad-section-heading">
                    <div>
                        <h2>Field Activity & Leads</h2>
                        <p>Visits, registrations and lead management</p>
                    </div>
                </div>

                <div className="ad-metric-grid ad-activity-grid">
                    {activityMetrics.map((metric) => {
                        const Icon = metric.icon;

                        return (
                            <article className="ad-activity-card" key={metric.title}>
                                <div className="ad-icon-box">
                                    <Icon size={20} />
                                </div>
                                <div className="ad-activity-info">
                                    <p>{metric.title}</p>
                                    <strong>{loading ? "..." : metric.value}</strong>
                                    <span>Based on available records</span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="ad-section">
                <div className="ad-section-heading">
                    <div>
                        <h2>Collections & Follow-ups</h2>
                        <p>Financial status and pending actions</p>
                    </div>
                </div>

                <div className="ad-metric-grid ad-finance-grid">
                    {financeMetrics.map((metric) => {
                        const Icon = metric.icon;

                        return (
                            <article className="ad-finance-card" key={metric.title}>
                                <div className="ad-icon-box">
                                    <Icon size={21} />
                                </div>
                                <div>
                                    <p>{metric.title}</p>
                                    <h3>{loading ? "..." : metric.value}</h3>
                                    <span>{metric.description}</span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="ad-section">
                <div className="ad-section-heading">
                    <div>
                        <h2>Business Performance</h2>
                        <p>Territory and product-level insights</p>
                    </div>
                </div>

                <div className="ad-insights-grid">
                    <article className="ad-insight-card">
                        <div className="ad-insight-heading">
                            <div className="ad-icon-box">
                                <MapPinned size={21} />
                            </div>
                            <div>
                                <h3>Territory Performance</h3>
                                <p>Sales and activity by territory</p>
                            </div>
                        </div>

                        <div className="ad-placeholder">
                            <MapPinned size={30} />
                            <strong>Territory analytics</strong>
                            <span>
                                Territory-wise sales data requires territory mapping in the API.
                            </span>
                        </div>
                    </article>

                    <article className="ad-insight-card">
                        <div className="ad-insight-heading">
                            <div className="ad-icon-box">
                                <Package size={21} />
                            </div>
                            <div>
                                <h3>Product-wise Sales</h3>
                                <p>Product sales distribution</p>
                            </div>
                        </div>

                        <div className="ad-placeholder">
                            <Package size={30} />
                            <strong>Product analytics</strong>
                            <span>
                                Product-wise sales needs the order items and product details.
                            </span>
                        </div>
                    </article>

                    <article className="ad-insight-card ad-best-selling">
                        <div className="ad-insight-heading">
                            <div className="ad-icon-box">
                                <TrendingUp size={21} />
                            </div>
                            <div>
                                <h3>Best Selling Products</h3>
                                <p>Products ranked by sales</p>
                            </div>
                        </div>

                        <div className="ad-placeholder">
                            <Package size={30} />
                            <strong>Best sellers</strong>
                            <span>
                                Product ranking requires aggregation of order items.
                            </span>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
};

export default AnalyticsDashboard;
