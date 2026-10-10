import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/dealer/DealerComplaintManagement.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const DealerComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    complaintType: "",
    subject: "",
    description: "",
    images: [],
    documents: [],
  });

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/dealer/complaints`,
        {
          params: {
            search: search || undefined,
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComplaints(response.data.complaints || []);
      }
    } catch (error) {
      console.error("Complaint fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleDocumentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      documents: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("complaintType", formData.complaintType);
      data.append("subject", formData.subject);
      data.append("description", formData.description);

      formData.images.forEach((file) => {
        data.append("images", file);
      });

      formData.documents.forEach((file) => {
        data.append("documents", file);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/dealer/complaints`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setShowModal(false);

        setFormData({
          complaintType: "",
          subject: "",
          description: "",
          images: [],
          documents: [],
        });

        fetchComplaints();
      }
    } catch (error) {
      console.error("Complaint submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getComplaintType = (type) => {
    const types = {
      PRODUCT: "Product Complaint",
      SERVICE: "Service Complaint",
      DELIVERY: "Delivery Complaint",
      PAYMENT: "Payment Complaint",
    };

    return types[type] || type || "-";
  };

  const getStatusClass = (status) => {
    return `complaint-status ${String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return "";

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    return `${API_BASE_URL}${filePath}`;
  };

  return (
    <div className="dealer-complaint-management">
      <div className="complaint-page-header">
        <div>
          <h1>Complaint Management</h1>
          <p>Raise and track your complaints</p>
        </div>

        <button
          className="raise-complaint-btn"
          onClick={() => setShowModal(true)}
        >
          Raise Complaint
        </button>
      </div>

      <div className="complaint-filter-card">
        <div className="complaint-search-box">
          <input
            type="text"
            placeholder="Search complaint..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchComplaints();
              }
            }}
          />
        </div>

        <div className="complaint-date-field">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="complaint-date-field">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button className="complaint-filter-btn" onClick={fetchComplaints}>
          Search
        </button>

        <button
          className="complaint-refresh-btn"
          onClick={() => {
            setSearch("");
            setFromDate("");
            setToDate("");
            setTimeout(fetchComplaints, 0);
          }}
        >
          Refresh
        </button>
      </div>

      <div className="complaint-history-card">
        <div className="complaint-history-header">
          <div>
            <h2>Complaint History</h2>
            <p>View your submitted complaints and their status</p>
          </div>

          <span className="complaint-count">
            {complaints.length} Complaints
          </span>
        </div>

        {loading ? (
          <div className="complaint-empty">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <div className="complaint-empty">No complaints found</div>
        ) : (
          <div className="complaint-table-wrapper">
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Type</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Images</th>
                  <th>Documents</th>
                  <th>Created On</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.complaintId}</td>

                    <td>{getComplaintType(complaint.complaintType)}</td>

                    <td>
                      <div className="complaint-subject">
                        {complaint.subject}
                      </div>

                      <div className="complaint-description">
                        {complaint.description}
                      </div>
                    </td>

                    <td>
                      <span className={getStatusClass(complaint.status)}>
                        {complaint.status}
                      </span>
                    </td>

                    <td>{complaint.images?.length || 0}</td>

                    <td>{complaint.documents?.length || 0}</td>

                    <td>{formatDate(complaint.createdAt)}</td>

                    <td>
                      <button
                        className="complaint-view-btn"
                        onClick={() => setSelectedComplaint(complaint)}
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

      {showModal && (
        <div
          className="complaint-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="complaint-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="complaint-modal-header">
              <div>
                <h2>Raise Complaint</h2>
                <p>Submit your complaint details</p>
              </div>

              <button
                className="complaint-modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="complaint-form-group">
                <label>Complaint Type</label>

                <select
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Complaint Type</option>
                  <option value="PRODUCT">Product Complaint</option>
                  <option value="SERVICE">Service Complaint</option>
                  <option value="DELIVERY">Delivery Complaint</option>
                  <option value="PAYMENT">Payment Complaint</option>
                </select>
              </div>

              <div className="complaint-form-group">
                <label>Subject</label>

                <input
                  type="text"
                  name="subject"
                  placeholder="Enter complaint subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="complaint-form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Enter complaint description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              <div className="complaint-form-group">
                <label>Upload Images</label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={handleImageChange}
                />

                <small>Maximum 5 images, 10 MB each</small>
              </div>

              <div className="complaint-form-group">
                <label>Upload Documents</label>

                <input
                  type="file"
                  accept=".pdf,.xls,.xlsx,.doc,.docx"
                  multiple
                  onChange={handleDocumentChange}
                />

                <small>
                  PDF, Excel and Word documents. Maximum 5 files, 10 MB each
                </small>
              </div>

              <div className="complaint-modal-actions">
                <button
                  type="button"
                  className="complaint-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="complaint-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedComplaint && (
        <div
          className="complaint-modal-overlay"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="complaint-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="complaint-modal-header">
              <div>
                <h2>Complaint Details</h2>
                <p>{selectedComplaint.complaintId}</p>
              </div>

              <button
                className="complaint-modal-close"
                onClick={() => setSelectedComplaint(null)}
              >
                ×
              </button>
            </div>

            <div className="complaint-details-content">
              <div className="complaint-details-grid">
                <div>
                  <span>Complaint ID</span>
                  <strong>{selectedComplaint.complaintId}</strong>
                </div>

                <div>
                  <span>Complaint Type</span>
                  <strong>
                    {getComplaintType(selectedComplaint.complaintType)}
                  </strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{selectedComplaint.status}</strong>
                </div>

                <div>
                  <span>Created On</span>
                  <strong>{formatDate(selectedComplaint.createdAt)}</strong>
                </div>
              </div>

              <div className="complaint-detail-section">
                <span>Subject</span>
                <p>{selectedComplaint.subject}</p>
              </div>

              <div className="complaint-detail-section">
                <span>Description</span>
                <p>{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.images?.length > 0 && (
                <div className="complaint-detail-section">
                  <span>Uploaded Images</span>

                  <div className="complaint-images-grid">
                    {selectedComplaint.images.map((image, index) => {
                      const imageUrl = getFileUrl(image);

                      return (
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={index}
                        >
                          <img
                            src={imageUrl}
                            alt={`Complaint ${index + 1}`}
                            className="complaint-detail-image"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedComplaint.documents?.length > 0 && (
                <div className="complaint-detail-section">
                  <span>Uploaded Documents</span>

                  <div className="complaint-documents-list">
                    {selectedComplaint.documents.map((document, index) => {
                      const documentUrl = getFileUrl(document);

                      return (
                        <a
                          href={documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="complaint-document-link"
                          key={index}
                        >
                          View Document {index + 1}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealerComplaintManagement;