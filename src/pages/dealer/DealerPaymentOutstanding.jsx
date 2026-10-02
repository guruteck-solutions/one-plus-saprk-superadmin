import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/dealer/DealerPaymentOutstanding.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerPaymentOutstanding = () => {
  const [data, setData] = useState({
    summary: {
      totalInvoiceAmount: 0,
      totalPayments: 0,
      totalOutstanding: 0,
      totalCreditBalance: 0,
      invoiceCount: 0,
      paymentCount: 0,
      outstandingCount: 0,
    },
    invoices: [],
    payments: [],
    outstanding: [],
    creditTransactions: [],
    transactions: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const fetchPaymentOutstanding = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/dealer/payment-outstanding`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Payment outstanding fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentOutstanding();
  }, []);

  const formatCurrency = (amount) => {
    return `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getTabData = () => {
    switch (activeTab) {
      case "INVOICES":
        return data.invoices;

      case "PAYMENTS":
        return data.payments;

      case "OUTSTANDING":
        return data.outstanding;

      case "CREDIT":
        return data.creditTransactions;

      default:
        return data.transactions;
    }
  };

  const transactions = getTabData();

  if (loading) {
    return (
      <div className="dealer-payment-page">
        <div className="payment-loading">Loading payment details...</div>
      </div>
    );
  }

  return (
    <div className="dealer-payment-page">
      <div className="dealer-payment-header">
        <div>
          <h1>Payment & Outstanding</h1>
          <p>View your payments, invoices and outstanding amounts</p>
        </div>

        <button
          className="payment-refresh-btn"
          onClick={fetchPaymentOutstanding}
        >
          Refresh
        </button>
      </div>

      <div className="payment-summary-grid">
        <div className="payment-summary-card">
          <span>Total Invoice Amount</span>
          <strong>{formatCurrency(data.summary.totalInvoiceAmount)}</strong>
          <small>{data.summary.invoiceCount} invoices</small>
        </div>

        <div className="payment-summary-card">
          <span>Total Payments</span>
          <strong>{formatCurrency(data.summary.totalPayments)}</strong>
          <small>{data.summary.paymentCount} payments</small>
        </div>

        <div className="payment-summary-card">
          <span>Total Outstanding</span>
          <strong>{formatCurrency(data.summary.totalOutstanding)}</strong>
          <small>{data.summary.outstandingCount} outstanding</small>
        </div>

        <div className="payment-summary-card">
          <span>Credit Balance</span>
          <strong>{formatCurrency(data.summary.totalCreditBalance)}</strong>
          <small>Available credit</small>
        </div>
      </div>

      <div className="payment-tabs">
        <button
          className={activeTab === "ALL" ? "active" : ""}
          onClick={() => setActiveTab("ALL")}
        >
          All Transactions
        </button>

        <button
          className={activeTab === "INVOICES" ? "active" : ""}
          onClick={() => setActiveTab("INVOICES")}
        >
          Invoice List
        </button>

        <button
          className={activeTab === "PAYMENTS" ? "active" : ""}
          onClick={() => setActiveTab("PAYMENTS")}
        >
          Payment History
        </button>

        <button
          className={activeTab === "OUTSTANDING" ? "active" : ""}
          onClick={() => setActiveTab("OUTSTANDING")}
        >
          Outstanding
        </button>

        <button
          className={activeTab === "CREDIT" ? "active" : ""}
          onClick={() => setActiveTab("CREDIT")}
        >
          Credit Balance
        </button>
      </div>

      <div className="payment-table-card">
        <div className="payment-table-header">
          <h2>
            {activeTab === "ALL"
              ? "All Transactions"
              : activeTab === "INVOICES"
              ? "Invoice List"
              : activeTab === "PAYMENTS"
              ? "Payment History"
              : activeTab === "OUTSTANDING"
              ? "Outstanding"
              : "Credit Balance"}
          </h2>
        </div>

        {transactions.length === 0 ? (
          <div className="payment-empty-state">
            No records found
          </div>
        ) : (
          <div className="payment-table-wrapper">
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Invoice</th>
                  <th>Amount</th>
                  <th>Payment Mode</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{transaction.transactionId || "-"}</td>

                    <td>{formatDate(transaction.date)}</td>

                    <td>{transaction.description || "-"}</td>

                    <td>{transaction.invoice || "-"}</td>

                    <td>{formatCurrency(transaction.amount)}</td>

                    <td>
                      {transaction.paymentMode &&
                      transaction.paymentMode !== "NA"
                        ? transaction.paymentMode.replaceAll("_", " ")
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`payment-status payment-status-${String(
                          transaction.status || ""
                        ).toLowerCase()}`}
                      >
                        {transaction.status || "-"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="payment-view-btn"
                        onClick={() =>
                          setSelectedTransaction(transaction)
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTransaction && (
        <div
          className="payment-modal-overlay"
          onClick={() => setSelectedTransaction(null)}
        >
          <div
            className="payment-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="payment-modal-header">
              <h2>Transaction Details</h2>

              <button onClick={() => setSelectedTransaction(null)}>
                ×
              </button>
            </div>

            <div className="payment-details-grid">
              <div>
                <span>Transaction ID</span>
                <strong>
                  {selectedTransaction.transactionId || "-"}
                </strong>
              </div>

              <div>
                <span>Date</span>
                <strong>
                  {formatDate(selectedTransaction.date)}
                </strong>
              </div>

              <div>
                <span>Type</span>
                <strong>
                  {selectedTransaction.type || "-"}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedTransaction.status || "-"}
                </strong>
              </div>

              <div>
                <span>Description</span>
                <strong>
                  {selectedTransaction.description || "-"}
                </strong>
              </div>

              <div>
                <span>Category</span>
                <strong>
                  {selectedTransaction.category || "-"}
                </strong>
              </div>

              <div>
                <span>Account</span>
                <strong>
                  {selectedTransaction.account || "-"}
                </strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>
                  {formatCurrency(selectedTransaction.amount)}
                </strong>
              </div>

              <div>
                <span>Payment Mode</span>
                <strong>
                  {selectedTransaction.paymentMode || "-"}
                </strong>
              </div>

              <div>
                <span>Invoice</span>
                <strong>
                  {selectedTransaction.invoice || "-"}
                </strong>
              </div>
            </div>

            <div className="payment-modal-footer">
              <button
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerPaymentOutstanding;