import React from "react";
import "../../css/painter/PainterDownloadProductImages.css";

const PainterDownloadProductImages = () => {
    const imageSlots = Array.from({ length: 6 });

    return (
        <div className="painter-product-images-page">

            <div className="painter-product-images-header">
                <h1>Product Images</h1>

                <p>
                    Oneplus Spark PAINTS • Painter experience
                </p>
            </div>

            <div className="painter-product-images-card">

                <h2>Product Images</h2>

                <div className="painter-product-images-grid">

                    {imageSlots.map((_, index) => (
                        <div
                            className="painter-product-image-box"
                            key={index}
                        >
                            <span>PRODUCT IMAGE</span>
                        </div>
                    ))}

                </div>

            </div>

            <div className="painter-product-images-footer">
                © Oneplus Spark PAINTS • Painter Mobile App UI
            </div>

        </div>
    );
};

export default PainterDownloadProductImages;