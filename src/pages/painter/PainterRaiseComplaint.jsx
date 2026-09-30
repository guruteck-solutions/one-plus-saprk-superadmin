import React, { useState } from "react";
import { Upload, X, Image, Video } from "lucide-react";
import { toast } from "sonner";
import "../../css/painter/PainterRaiseComplaint.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const PainterRaiseComplaint = () => {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    priority: "Medium",
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type.startsWith("video/")
    );

    setFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.type || !formData.title || !formData.description) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("type", formData.type);
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priority", formData.priority);

      files.forEach((file) => {
        data.append("attachments", file);
      });

      const response = await fetch(
        `${API_BASE_URL}/api/painter/complaints`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to submit complaint."
        );
      }

      toast.success("Complaint submitted successfully.");

      setFormData({
        type: "",
        title: "",
        description: "",
        priority: "Medium",
      });

      setFiles([]);
    } catch (err) {
      console.error("Raise complaint error:", err);
      toast.error(err.message || "Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="painter-raise-complaint-page">
      <div className="painter-raise-complaint-header">
        <div>
          <h1>Raise Complaint</h1>
          <p>Submit a complaint regarding products or services</p>
        </div>
      </div>

      <div className="painter-raise-complaint-card">
        <form onSubmit={handleSubmit}>
          <div className="painter-raise-form-group">
            <label>
              Complaint Type <span>*</span>
            </label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select complaint type</option>
              <option value="Product Complaint">
                Product Complaint
              </option>
              <option value="Service Complaint">
                Service Complaint
              </option>
              <option value="Dealer Complaint">
                Dealer Complaint
              </option>
              <option value="Delivery Complaint">
                Delivery Complaint
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="painter-raise-form-group">
            <label>
              Title <span>*</span>
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter complaint title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="painter-raise-form-group">
            <label>
              Description <span>*</span>
            </label>

            <textarea
              name="description"
              placeholder="Describe the issue..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
            />
          </div>

          <div className="painter-raise-form-group">
            <label>Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="painter-raise-form-group">
            <label>Attachments</label>

            <label className="painter-raise-upload-box">
              <Upload size={20} />
              <span>Upload images / videos</span>
              <small>Maximum 5 files</small>

              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="painter-raise-file-list">
              {files.map((file, index) => (
                <div
                  className="painter-raise-file-item"
                  key={`${file.name}-${index}`}
                >
                  <div className="painter-raise-file-info">
                    {file.type.startsWith("image/") ? (
                      <Image size={18} />
                    ) : (
                      <Video size={18} />
                    )}

                    <span>{file.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="painter-raise-remove-file"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="painter-raise-submit-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PainterRaiseComplaint;