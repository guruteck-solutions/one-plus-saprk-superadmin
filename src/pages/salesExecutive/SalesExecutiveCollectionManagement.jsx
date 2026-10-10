import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  RefreshCw,
  Search,
  Wallet,
  ReceiptText,
  Upload,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import "../../css/salesExecutive/SalesExecutiveCollectionManagement.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const getAuthConfig = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const initialForm = {
  salesOrder: "",
  paymentAmount: "",
  paymentMethod: "Cash",
  transactionReference: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  remarks: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const getStatusClass = (status) =>
  `scm-status scm-status-${String(status || "pending")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

export default function SalesExecutiveCollectionManagement() {
  const [invoices, setInvoices] = useState([]);
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [receipt, setReceipt] = useState(null);
  const [chequeImage, setChequeImage] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [search, setSearch] = useState("");
  const [historyStatus, setHistoryStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const selectedInvoice = invoices.find(
    (invoice) => invoice.salesOrderId === form.salesOrder
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const config = getAuthConfig();

      const [invoiceResponse, collectionResponse] = await Promise.all([
        axios.get(
          `${API_BASE_URL}/api/sales-executive/collections/outstanding-invoices`,
          config
        ),
        axios.get(
          `${API_BASE_URL}/api/sales-executive/collections`,
          {
            ...config,
            params: historyStatus ? { status: historyStatus } : {},
          }
        ),
      ]);

      setInvoices(invoiceResponse.data.invoices || []);
      setCollections(collectionResponse.data.collections || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load collection data. Please refresh the page."
      );
    } finally {
      setLoading(false);
    }
  }, [historyStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setNotice("");
  };

  const handleInvoiceChange = (event) => {
    const salesOrderId = event.target.value;
    const invoice = invoices.find(
      (item) => item.salesOrderId === salesOrderId
    );

    setForm((previous) => ({
      ...previous,
      salesOrder: salesOrderId,
      paymentAmount: "",
    }));

    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!selectedInvoice) {
      setError("Please select an outstanding invoice.");
      return;
    }

    const amount = Number(form.paymentAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    if (amount > selectedInvoice.outstandingAmount) {
      setError(
        `Payment cannot exceed the outstanding amount of ${formatCurrency(
          selectedInvoice.outstandingAmount
        )}.`
      );
      return;
    }

    if (form.paymentMethod === "Cheque" && !chequeImage) {
      setError("Please upload the cheque image.");
      return;
    }

    if (form.paymentMethod === "UPI" && !paymentScreenshot) {
      setError("Please upload the UPI payment screenshot.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();
      payload.append("salesOrder", form.salesOrder);
      payload.append("paymentAmount", String(amount));
      payload.append("paymentMethod", form.paymentMethod);
      payload.append("transactionReference", form.transactionReference);
      payload.append("paymentDate", form.paymentDate);
      payload.append("remarks", form.remarks);

      if (receipt) payload.append("receipt", receipt);
      if (chequeImage) payload.append("chequeImage", chequeImage);
      if (paymentScreenshot) {
        payload.append("paymentScreenshot", paymentScreenshot);
      }

      await axios.post(
        `${API_BASE_URL}/api/sales-executive/collections`,
        payload,
        {
          ...getAuthConfig(),
        }
      );

      setNotice(
        "Payment entry saved successfully. It is pending verification."
      );
      setForm(initialForm);
      setReceipt(null);
      setChequeImage(null);
      setPaymentScreenshot(null);

      const fileInputs = document.querySelectorAll(
        ".scm-file-input"
      );
      fileInputs.forEach((input) => {
        input.value = "";
      });

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save payment entry."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const searchText = search.toLowerCase();

    return (
      invoice.orderId?.toLowerCase().includes(searchText) ||
      invoice.dealer?.name?.toLowerCase().includes(searchText) ||
      invoice.dealer?.email?.toLowerCase().includes(searchText)
    );
  });

  const totalOutstanding = invoices.reduce(
    (total, invoice) => total + Number(invoice.outstandingAmount || 0),
    0
  );

  const totalCollected = invoices.reduce(
    (total, invoice) => total + Number(invoice.collectedAmount || 0),
    0
  );

  const pendingCount = collections.filter(
    (item) => item.status === "Pending"
  ).length;

  const fileUrl = (path) =>
    path ? `${API_BASE_URL}${path}` : "";

  return (
    <div className="scm-page">
      <div className="scm-header">
        <div>
          <h1>Collection Management</h1>
          <p>Manage outstanding invoices and dealer payments.</p>
        </div>

        <button
          type="button"
          className="scm-refresh-btn"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "scm-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="scm-alert scm-alert-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {notice && (
        <div className="scm-alert scm-alert-success" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="scm-summary-grid">
        <div className="scm-summary-card">
          <div className="scm-summary-icon">
            <ReceiptText size={21} />
          </div>
          <div>
            <span>Outstanding Invoices</span>
            <h2>{invoices.length}</h2>
          </div>
        </div>

        <div className="scm-summary-card">
          <div className="scm-summary-icon">
            <Wallet size={21} />
          </div>
          <div>
            <span>Total Outstanding</span>
            <h2>{formatCurrency(totalOutstanding)}</h2>
          </div>
        </div>

        <div className="scm-summary-card">
          <div className="scm-summary-icon">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Verified Collections</span>
            <h2>{formatCurrency(totalCollected)}</h2>
          </div>
        </div>

        <div className="scm-summary-card">
          <div className="scm-summary-icon">
            <Clock3 size={21} />
          </div>
          <div>
            <span>Pending Verification</span>
            <h2>{pendingCount}</h2>
          </div>
        </div>
      </div>

      <div className="scm-main-grid">
        <section className="scm-panel">
          <div className="scm-panel-heading">
            <div>
              <h2>Outstanding Invoice List</h2>
              <p>Select an invoice to record a payment.</p>
            </div>
            <span className="scm-count">{invoices.length}</span>
          </div>

          <div className="scm-search">
            <Search size={17} />
            <input
              type="search"
              placeholder="Search invoice or dealer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {loading ? (
            <div className="scm-state">Loading invoices...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="scm-state">
              No outstanding invoices found.
            </div>
          ) : (
            <div className="scm-invoice-list">
              {filteredInvoices.map((invoice) => (
                <button
                  type="button"
                  key={invoice.salesOrderId}
                  className={`scm-invoice-card ${
                    form.salesOrder === invoice.salesOrderId
                      ? "scm-invoice-selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleInvoiceChange({
                      target: { value: invoice.salesOrderId },
                    })
                  }
                >
                  <div className="scm-invoice-top">
                    <strong>{invoice.orderId}</strong>
                    <span className={getStatusClass(invoice.collectionStatus)}>
                      {invoice.collectionStatus}
                    </span>
                  </div>

                  <div className="scm-dealer-name">
                    {invoice.dealer?.name || "Unknown dealer"}
                  </div>

                  <div className="scm-invoice-bottom">
                    <div>
                      <span>Invoice</span>
                      <strong>{formatCurrency(invoice.invoiceAmount)}</strong>
                    </div>
                    <div>
                      <span>Outstanding</span>
                      <strong className="scm-outstanding">
                        {formatCurrency(invoice.outstandingAmount)}
                      </strong>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="scm-panel">
          <div className="scm-panel-heading">
            <div>
              <h2>Payment Entry</h2>
              <p>Record cash or digital payments.</p>
            </div>
            <Wallet size={21} className="scm-heading-icon" />
          </div>

          <form className="scm-form" onSubmit={handleSubmit}>
            <div className="scm-field">
              <label htmlFor="salesOrder">Outstanding Invoice *</label>
              <select
                id="salesOrder"
                name="salesOrder"
                value={form.salesOrder}
                onChange={handleInvoiceChange}
                required
              >
                <option value="">Select invoice</option>
                {invoices.map((invoice) => (
                  <option
                    key={invoice.salesOrderId}
                    value={invoice.salesOrderId}
                  >
                    {invoice.orderId} — {invoice.dealer?.name || "Dealer"}
                  </option>
                ))}
              </select>
            </div>

            {selectedInvoice && (
              <div className="scm-selected-invoice">
                <div>
                  <span>Invoice Amount</span>
                  <strong>
                    {formatCurrency(selectedInvoice.invoiceAmount)}
                  </strong>
                </div>
                <div>
                  <span>Outstanding</span>
                  <strong className="scm-outstanding">
                    {formatCurrency(selectedInvoice.outstandingAmount)}
                  </strong>
                </div>
              </div>
            )}

            <div className="scm-form-row">
              <div className="scm-field">
                <label htmlFor="paymentAmount">Payment Amount (₹) *</label>
                <input
                  id="paymentAmount"
                  type="number"
                  name="paymentAmount"
                  min="0.01"
                  max={selectedInvoice?.outstandingAmount || undefined}
                  step="0.01"
                  placeholder="Enter amount"
                  value={form.paymentAmount}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="scm-field">
                <label htmlFor="paymentDate">Payment Date *</label>
                <input
                  id="paymentDate"
                  type="date"
                  name="paymentDate"
                  value={form.paymentDate}
                  onChange={updateField}
                  required
                />
              </div>
            </div>

            <div className="scm-field">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={updateField}
                required
              >
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
              </select>
            </div>

            <div className="scm-field">
              <label htmlFor="transactionReference">
                Transaction / Cheque Reference
              </label>
              <input
                id="transactionReference"
                name="transactionReference"
                placeholder="Enter reference number"
                value={form.transactionReference}
                onChange={updateField}
              />
            </div>

            <div className="scm-upload-grid">
              <div className="scm-field">
                <label htmlFor="receipt">Receipt</label>
                <label className="scm-upload-box" htmlFor="receipt">
                  <Upload size={19} />
                  <span>{receipt?.name || "Upload receipt"}</span>
                  <small>PDF or image, max 10 MB</small>
                </label>
                <input
                  className="scm-file-input"
                  id="receipt"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(event) =>
                    setReceipt(event.target.files?.[0] || null)
                  }
                />
              </div>

              {form.paymentMethod === "Cheque" && (
                <div className="scm-field">
                  <label htmlFor="chequeImage">Cheque Image *</label>
                  <label className="scm-upload-box" htmlFor="chequeImage">
                    <Upload size={19} />
                    <span>
                      {chequeImage?.name || "Upload cheque image"}
                    </span>
                    <small>JPG, PNG or WEBP</small>
                  </label>
                  <input
                    className="scm-file-input"
                    id="chequeImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      setChequeImage(event.target.files?.[0] || null)
                    }
                  />
                </div>
              )}

              {form.paymentMethod === "UPI" && (
                <div className="scm-field">
                  <label htmlFor="paymentScreenshot">
                    Payment Screenshot *
                  </label>
                  <label
                    className="scm-upload-box"
                    htmlFor="paymentScreenshot"
                  >
                    <Upload size={19} />
                    <span>
                      {paymentScreenshot?.name || "Upload screenshot"}
                    </span>
                    <small>JPG, PNG or WEBP</small>
                  </label>
                  <input
                    className="scm-file-input"
                    id="paymentScreenshot"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) =>
                      setPaymentScreenshot(event.target.files?.[0] || null)
                    }
                  />
                </div>
              )}
            </div>

            <div className="scm-field">
              <label htmlFor="remarks">Payment Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                rows="3"
                placeholder="Add payment notes..."
                value={form.remarks}
                onChange={updateField}
              />
            </div>

            <div className="scm-form-actions">
              <button
                type="button"
                className="scm-reset-btn"
                onClick={() => {
                  setForm(initialForm);
                  setReceipt(null);
                  setChequeImage(null);
                  setPaymentScreenshot(null);
                  setError("");
                  setNotice("");
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="scm-submit-btn"
                disabled={submitting || loading}
              >
                {submitting ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </form>
        </section>
      </div>

      <section className="scm-panel scm-history-panel">
        <div className="scm-panel-heading">
          <div>
            <h2>Collection History</h2>
            <p>Review previously recorded payment entries.</p>
          </div>

          <select
            className="scm-history-filter"
            value={historyStatus}
            onChange={(event) => setHistoryStatus(event.target.value)}
            aria-label="Filter collection status"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="scm-state">Loading collection history...</div>
        ) : collections.length === 0 ? (
          <div className="scm-state">
            <FileText size={28} />
            <span>No collection history found.</span>
          </div>
        ) : (
          <div className="scm-table-wrap">
            <table className="scm-table">
              <thead>
                <tr>
                  <th>Collection ID</th>
                  <th>Invoice</th>
                  <th>Dealer</th>
                  <th>Payment Date</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection) => (
                  <tr key={collection._id}>
                    <td>
                      <strong>{collection.collectionId}</strong>
                    </td>
                    <td>
                      {collection.salesOrder?.orderId || "—"}
                    </td>
                    <td>{collection.dealer?.name || "—"}</td>
                    <td>{formatDate(collection.paymentDate)}</td>
                    <td>{collection.paymentMethod}</td>
                    <td className="scm-amount">
                      {formatCurrency(collection.paymentAmount)}
                    </td>
                    <td>
                      <span className={getStatusClass(collection.status)}>
                        {collection.status}
                      </span>
                    </td>
                    <td>
                      {collection.receiptUrl ? (
                        <a
                          className="scm-receipt-link"
                          href={fileUrl(collection.receiptUrl)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FileText size={15} />
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}