import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Download, FileText } from "lucide-react";
import "../../css/painter/PainterDownloadProductDetails.css";
import { toast } from "sonner";

const PRODUCT_API = "https://reality-crm-wmos.onrender.com/api/painter/products";
const DOCUMENT_API = "https://reality-crm-wmos.onrender.com/api/painter/documents/categories";
const DOWNLOAD_API = "https://reality-crm-wmos.onrender.com/api/documents";
const SERVER_URL = "https://reality-crm-wmos.onrender.com";

const DOCUMENT_TYPES = [
    {
        category: "BROCHURE",
        label: "Product Brochure",
    },
    {
        category: "TECHNICAL_DATA_SHEET",
        label: "Technical Data Sheet",
    },
    {
        category: "APPLICATION_GUIDE",
        label: "Application Guide",
    },
    {
        category: "WARRANTY",
        label: "Warranty",
    },
];

const PainterDownloadProductDetails = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [documents, setDocuments] = useState({});
    const [loading, setLoading] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);

    const fetchProductDetails = async () => {
        if (!id) {
            setProduct(null);
            setDocuments({});
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const [productResponse, documentResponse] =
                await Promise.all([
                    axios.get(
                        `${PRODUCT_API}/${id}`,
                        config
                    ),
                    axios.get(
                        DOCUMENT_API,
                        config
                    ),
                ]);

            if (productResponse.data?.success) {
                setProduct(productResponse.data.product);
            } else {
                setProduct(null);
            }

            if (documentResponse.data?.success) {
                const categoryDocuments = {};

                documentResponse.data.categories?.forEach(
                    (category) => {
                        categoryDocuments[category.value] =
                            category.documents || [];
                    }
                );

                setDocuments(categoryDocuments);
            }
        } catch (error) {
            console.error(
                "Fetch product details error:",
                error
            );

            setProduct(null);
            setDocuments({});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const handleDownload = async (document) => {
        if (!document?._id) {
            return;
        }

        try {
            setDownloadingId(document._id);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${DOWNLOAD_API}/${document._id}/download`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data]);

            const url = window.URL.createObjectURL(blob);

            const link = window.document.createElement("a");

            link.href = url;

            link.download =
                document.fileName ||
                document.documentName ||
                "document";

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
            setDownloadingId(null);
        }
    };

    /* ==========================================
       SIDEBAR SE DIRECT OPEN
    ========================================== */

    if (!id) {
        return (
            <div className="painter-product-details-page">

                <div className="painter-product-details-header">
                    <div>
                        <h1>Product Details</h1>

                        <p>
                            Oneplus Spark PAINTS • Painter experience
                        </p>
                    </div>
                </div>

                <div className="painter-product-details-select-message">
                    <div className="painter-product-details-select-icon">
                        <FileText size={28} />
                    </div>

                    <h2>Please select a product</h2>

                    <p>
                        Go to Product Listing and select a
                        product to view its details.
                    </p>
                </div>

            </div>
        );
    }

    /* ==========================================
       LOADING
    ========================================== */

    if (loading) {
        return (
            <div className="painter-product-details-page">

                <div className="painter-product-details-loading">
                    Loading product details...
                </div>

            </div>
        );
    }

    /* ==========================================
       PRODUCT NOT FOUND
    ========================================== */

    if (!product) {
        return (
            <div className="painter-product-details-page">

                <div className="painter-product-details-empty">
                    Product not found.
                </div>

            </div>
        );
    }

    return (
        <div className="painter-product-details-page">

            {/* HEADER */}

            <div className="painter-product-details-header">
                <div>
                    <h1>Product Details</h1>

                    <p>
                        Oneplus Spark PAINTS • Painter experience
                    </p>
                </div>
            </div>

            {/* MAIN CARD */}

            <div className="painter-product-details-card">

                {/* PRODUCT IMAGE */}

                <div className="painter-product-details-image">
                    {product.image ? (
                        <img
                            src={`${SERVER_URL}${product.image}`}
                            alt={product.productName || "Product"}
                        />
                    ) : (
                        <>
                            <span>PRODUCT</span>
                            <strong>IMAGE</strong>
                        </>
                    )}
                </div>

                {/* PRODUCT CONTENT */}

                <div className="painter-product-details-content">

                    <h2>{product.productName}</h2>

                    {/* PRODUCT INFORMATION */}

                    <div className="painter-product-details-info">

                        <div>
                            <span>SKU</span>

                            <strong>
                                {product.sku || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Category</span>

                            <strong>
                                {product.category || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Brand</span>

                            <strong>
                                {product.brand || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Packing Size</span>

                            <strong>
                                {product.packingSize || "-"}
                            </strong>
                        </div>

                    </div>

                    {/* TECHNICAL DOCUMENTS */}

                    <h3>Technical documents</h3>

                    <div className="painter-product-document-list">

                        {DOCUMENT_TYPES.map((item) => {

                            const availableDocument =
                                documents[item.category]?.[0];

                            const isDownloading =
                                downloadingId ===
                                availableDocument?._id;

                            return (
                                <div
                                    className="painter-product-document-row"
                                    key={item.category}
                                >

                                    <div className="painter-product-document-left">

                                        <div className="painter-product-document-icon">
                                            <FileText size={17} />
                                        </div>

                                        <strong>
                                            {item.label}
                                        </strong>

                                    </div>

                                    <button
                                        type="button"
                                        disabled={
                                            !availableDocument ||
                                            isDownloading
                                        }
                                        onClick={() =>
                                            handleDownload(
                                                availableDocument
                                            )
                                        }
                                    >

                                        <Download size={15} />

                                        {isDownloading
                                            ? "Downloading..."
                                            : "Download"}

                                    </button>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default PainterDownloadProductDetails;