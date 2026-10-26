import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download, FileText } from "lucide-react";
import "../../css/painter/PainterDownloadDocumentPreview.css";
import { toast } from "sonner";
import { API_BASE_URL } from "../../config/api";

const DOCUMENT_API =
    `${API_BASE_URL}/api/painter/documents/categories`;

const DOWNLOAD_API =
    `${API_BASE_URL}/api/documents`;

const PainterDownloadDocumentPreview = () => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const fetchDocument = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                DOCUMENT_API,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.success) {
                const brochureCategory =
                    response.data.categories?.find(
                        (category) =>
                            category.value === "BROCHURE"
                    );

                const brochureDocument =
                    brochureCategory?.documents?.[0];

                setDocument(
                    brochureDocument || null
                );
            }
        } catch (error) {
            console.error(
                "Fetch document preview error:",
                error
            );

            setDocument(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, []);

    const handleDownload = async () => {
        if (!document?._id) {
            return;
        }

        try {
            setDownloading(true);

            const token =
                localStorage.getItem("token");

            const response = await axios.get(
                `${DOWNLOAD_API}/${document._id}/download`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers[
                        "content-type"
                        ] || "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                window.document.createElement("a");

            link.href = url;

            link.download =
                document.fileName ||
                document.documentName ||
                "document.pdf";

            window.document.body.appendChild(link);

            link.click();

            window.document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(
                "Download document error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to download document."
            );
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="painter-document-preview-page">

            {/* HEADER */}

            <div className="painter-document-preview-header">
                <div>
                    <h1>
                        Document Preview
                    </h1>

                    <p>
                        Oneplus Spark PAINTS • Painter experience
                    </p>
                </div>
            </div>

            {/* PREVIEW CARD */}

            <div className="painter-document-preview-card">

                <h2>
                    Document Preview
                </h2>

                {loading ? (
                    <div className="painter-document-preview-loading">
                        Loading document...
                    </div>
                ) : !document ? (
                    <div className="painter-document-preview-empty">

                        <div className="painter-document-preview-empty-icon">
                            <FileText size={28} />
                        </div>

                        <h3>
                            Document not available
                        </h3>

                        <p>
                            Product brochure is currently
                            not available for preview.
                        </p>

                    </div>
                ) : (
                    <>
                        <div className="painter-document-preview-area">

                            <div className="painter-document-preview-content">

                                <strong>
                                    ONEPLUS SPARK*
                                </strong>

                                <h3>
                                    PRODUCT BROCHURE
                                </h3>

                                <p>
                                    {document.description ||
                                        "Product range • Features • Benefits • Application guidance"}
                                </p>

                                <div className="painter-document-preview-file">

                                    <FileText size={18} />

                                    <span>
                                        {document.fileName ||
                                            document.documentName}
                                    </span>

                                </div>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="painter-document-preview-download-btn"
                            onClick={handleDownload}
                            disabled={downloading}
                        >
                            <Download size={16} />

                            {downloading
                                ? "Downloading..."
                                : "Download PDF"}
                        </button>
                    </>
                )}

            </div>

            {/* FOOTER */}

            <div className="painter-document-preview-footer">
                © Oneplus Spark PAINTS • Painter Mobile App UI
            </div>

        </div>
    );
};

export default PainterDownloadDocumentPreview;