import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/painter/PainterShopCart.css";

const PainterShopCart = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const products = location.state?.products;

        if (Array.isArray(products) && products.length > 0) {
            setCartItems(products);
            return;
        }

        const product = location.state?.product;
        const quantity = Number(location.state?.quantity || 1);

        if (product) {
            setCartItems([
                {
                    product,
                    quantity: quantity >= 1 ? quantity : 1,
                },
            ]);
        }
    }, [location.state]);

    const subtotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            const price = Number(
                item.product?.discountPrice ||
                item.product?.mrp ||
                0
            );

            const quantity = Number(item.quantity) || 1;

            return total + price * quantity;
        }, 0);
    }, [cartItems]);

    const offer = 0;

    const total = subtotal - offer;

    const handleQuantityChange = (index, value) => {
        if (value === "") {
            setCartItems((previousItems) =>
                previousItems.map((item, itemIndex) =>
                    itemIndex === index
                        ? {
                              ...item,
                              quantity: "",
                          }
                        : item
                )
            );

            return;
        }

        const newQuantity = Number(value);

        if (newQuantity < 1 || Number.isNaN(newQuantity)) {
            return;
        }

        setCartItems((previousItems) =>
            previousItems.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          quantity: newQuantity,
                      }
                    : item
            )
        );
    };

    const handleQuantityBlur = (index) => {
        setCartItems((previousItems) =>
            previousItems.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          quantity:
                              Number(item.quantity) >= 1
                                  ? Number(item.quantity)
                                  : 1,
                      }
                    : item
            )
        );
    };

    const handleSubmitEnquiry = () => {
        if (cartItems.length === 0) {
            return;
        }

        const validCartItems = cartItems.map((item) => ({
            ...item,
            quantity:
                Number(item.quantity) >= 1
                    ? Number(item.quantity)
                    : 1,
        }));

        navigate("/painter/shop-submit-enquiry", {
            state: {
                cartItems: validCartItems,
                subtotal,
                offer,
                total,
            },
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="painter-shop-cart-page">
                <div className="painter-shop-cart-header">
                    <h1>Shopping Cart</h1>

                    <p>
                        Oneplus Spark PAINTS • Painter experience
                    </p>
                </div>

                <div className="painter-shop-cart-empty">
                    <h2>Please add a product</h2>

                    <p>
                        Select a product from the Product Listing
                        and add it to your cart.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/painter/shop-product-listing"
                            )
                        }
                    >
                        Go to Product Listing
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="painter-shop-cart-page">

            {/* HEADER */}
            <div className="painter-shop-cart-header">
                <h1>Shopping Cart</h1>

                <p>
                    Oneplus Spark PAINTS • Painter experience
                </p>
            </div>

            {/* CART LAYOUT */}
            <div className="painter-shop-cart-layout">

                {/* CART TABLE */}
                <div className="painter-shop-cart-card">

                    <h2>Shopping Cart</h2>

                    <div className="painter-shop-cart-table">

                        <div className="painter-shop-cart-table-header">
                            <span>Product</span>
                            <span>Qty</span>
                            <span>Price</span>
                            <span>Total</span>
                        </div>

                        {cartItems.map((item, index) => {
                            const price = Number(
                                item.product?.discountPrice ||
                                item.product?.mrp ||
                                0
                            );

                            const quantity =
                                Number(item.quantity) || 0;

                            const itemTotal =
                                price * quantity;

                            return (
                                <div
                                    className="painter-shop-cart-table-row"
                                    key={
                                        item.product?._id ||
                                        index
                                    }
                                >
                                    <div className="painter-shop-cart-product-name">
                                        {item.product?.productName ||
                                            "Product"}
                                    </div>

                                    {/* EDITABLE QUANTITY */}
                                    <div className="painter-shop-cart-quantity">
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            onBlur={() =>
                                                handleQuantityBlur(
                                                    index
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="painter-shop-cart-price">
                                        ₹
                                        {price.toLocaleString(
                                            "en-IN"
                                        )}
                                    </div>

                                    <div className="painter-shop-cart-total">
                                        ₹
                                        {itemTotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>

                {/* ORDER SUMMARY */}
                <div className="painter-shop-order-summary">

                    <h2>Order Summary</h2>

                    <div className="painter-shop-summary-row">
                        <span>Subtotal</span>

                        <strong>
                            ₹
                            {subtotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <div className="painter-shop-summary-row painter-shop-offer-row">
                        <span>Offer</span>

                        <strong>
                            -₹
                            {offer.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <div className="painter-shop-summary-divider"></div>

                    <div className="painter-shop-summary-total">
                        <span>Total</span>

                        <strong>
                            ₹
                            {total.toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                    <button
                        type="button"
                        className="painter-shop-submit-enquiry-cart-btn"
                        onClick={handleSubmitEnquiry}
                    >
                        Submit Enquiry
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PainterShopCart;