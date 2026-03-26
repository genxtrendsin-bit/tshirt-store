// ===== IMPORTS =====
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import "../styles/orders.css";
import OrderTracker from "../components/OrderTracker";

export default function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const expressPincodes = [
    "125051", // Ratia
    "125050", // Fatehabad
    "125055", // Sirsa
    "125001", // Hisar
    "125120", // Tohana
    "151501"  // Budhlada
  ];
  const isExpressDelivery = (pincode) => {
    if (!pincode) return false;
    return expressPincodes.includes(pincode.toString());
  };
  const navigate = useNavigate();

  const downloadInvoice = async (orderId) => {
    try {

      const res = await API.get(`/orders/${orderId}/invoice`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "invoice.pdf");

      document.body.appendChild(link);
      link.click();

    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetchOrders();
  }
}, []);

  const [customReason, setCustomReason] = useState("");

  /* HANDLE PRODUCT CLICK */
  const handleProductClick = (item) => {
    const productId = item.product?._id || item.product;

    if (!productId) {
      alert("Product no longer available");
      return;
    }

    navigate(`/product/${productId}`);
  };

  /* REFUND STATUS FORMATTER */
  const getRefundStatus = (order) => {
    if (order.refund?.status) return order.refund.status;

    if (order.status === "Cancelled") return "Pending";

    return "Not Applicable";
  };

  if (!orders.length) {
    return (
      <div className="orders-empty">
        <h2>No orders yet</h2>
      </div>
    );
  }

  const handleCancelOrder = async () => {

    if (!selectedOrder) return;

    const finalReason =
      cancelReason === "Other" ? customReason : cancelReason;

    if (!finalReason) {
      alert("Please select reason");
      return;
    }

    try {

      await API.put(`/orders/cancel/${selectedOrder._id}`, {
        reason: finalReason
      });

      alert("Order cancelled");

      // ✅ RESET EVERYTHING
      setShowCancelPopup(false);
      setCancelReason("");
      setCustomReason("");
      setSelectedOrder(null);

      fetchOrders();

    } catch (err) {
      console.log("CANCEL ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Cancel failed");
    }

  };

  return (

    <div className="orders-page">

      <h1>My Orders</h1>

      {orders.map(order => {

        const method = order.paymentMethod || "ONLINE";

        const upi = order.paymentDetails?.upiId;
        const cardLast4 = order.paymentDetails?.cardLast4;
        const cardBrand = order.paymentDetails?.cardBrand;

        const addr = order.shippingAddress || {};

        const delivery = new Date(order.createdAt);
        delivery.setDate(delivery.getDate() + 7);

        const isExpress = isExpressDelivery(order.shippingAddress?.postalCode);
        const refundStatus = getRefundStatus(order);

        return (

          <div key={order._id} className="order-card">

            {/* ================= HEADER ================= */}
            <div className="order-header">

              <div>

                <p><b>Order ID:</b> {order._id}</p>

                <p>
                  <b>Status:</b>{" "}
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </p>

                {order.trackingId && (
                  <p>
                    <b>Tracking ID:</b>{" "}
                    <span style={{ color: "#60a5fa", fontWeight: "500" }}>
                      {order.trackingId}
                    </span>
                  </p>
                )}

                {/* 🔥 PAYMENT STATUS BADGE */}

                {(() => {

                  const paymentStatus =
                    order.paymentStatus ||
                    (order.paymentMethod === "COD"
                      ? ((order.pendingAmount ?? (order.totalPrice - (order.codAdvanceAmount || 0))) > 0
                        ? "Partially Paid"
                        : "Paid")
                      : "Paid");

                  const badgeClass = paymentStatus
                    .toLowerCase()
                    .replace(/\s/g, "-");

                  return (
                    <p>
                      <b>Payment:</b>{" "}
                      <span className={`payment-badge ${badgeClass}`}>
                        {paymentStatus}
                      </span>
                    </p>
                  );

                })()}

                {/* 🔥 COD ADVANCE */}
                {order.paymentMethod === "COD" && order.codAdvancePaid && (
                  <p style={{ color: "#f59e0b", fontSize: "13px" }}>
                    ₹{order.codAdvanceAmount} advance paid (non-refundable)
                  </p>
                )}

                {/* 🔥 REFUND */}
                <p>
                  <b>Refund:</b>{" "}
                  <span className={`refund ${refundStatus.toLowerCase()}`}>
                    {refundStatus}
                  </span>
                </p>

                {order.refund?.status === "Completed" && (
                  <div style={{ fontSize: "12px", marginTop: "5px" }}>
                    <p>Refund ID: {order.refund.refundId}</p>
                    <p>
                      Refunded On:{" "}
                      {new Date(order.refund.refundedAt).toLocaleString()}
                    </p>
                  </div>
                )}

              </div>

              <div>

                <p>
                  <b>Ordered:</b>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <p>
                  <b>Delivery:</b>{" "}
                  {isExpress ? (
                    <span className="express-text">
                      ⚡ 3–4 Days Express Delivery
                    </span>
                  ) : (
                    delivery.toLocaleDateString()
                  )}
                </p>

                <p><b>Total:</b> ₹{order.totalPrice}</p>

                {/* 🔥 PAYMENT DETAILS */}


                <p>
                  <b>Payment:</b>{" "}
                  <span className={`payment-badge ${order.paymentStatus?.toLowerCase().replace(" ", "-")}`}>
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </p>

                {/* 🔥 SHOW DETAILS */}
                {upi && (
                  <p style={{ fontSize: "13px" }}>
                    <b>UPI:</b> {upi}
                  </p>
                )}

                {cardLast4 && (
                  <p style={{ fontSize: "13px" }}>
                    <b>Card:</b> {cardBrand} •••• {cardLast4}
                  </p>
                )}

                {/* COD */}
                {order.paymentMethod === "COD" && (
                  <p style={{ fontSize: "13px", color: "#f59e0b" }}>
                    Cash on Delivery
                  </p>
                )}
              </div>

            </div>

            {/* ================= PAYMENT SUMMARY ================= */}
            <div className="payment-summary">

              {order.paymentMethod === "COD" ? (

                <>
                  <p style={{ color: "#22c55e" }}>
                    Paid: ₹{order.paidAmount ?? (order.paymentMethod === "COD" ? order.codAdvanceAmount : order.totalPrice)}
                  </p>

                  <p><b>Method:</b> {method}</p>

                  {order.pendingAmount > 0 && (
                    <p style={{ color: "#f59e0b", fontWeight: "600" }}>
                      Pending: ₹{order.pendingAmount ?? (order.totalPrice - (order.codAdvanceAmount || 0))}
                    </p>
                  )}
                </>

              ) : (

                <p style={{ color: "#22c55e", fontWeight: "600" }}>
                  Fully Paid: ₹{order.totalPrice}
                </p>

              )}

            </div>

            <OrderTracker status={order.status} />

            {/* ================= ADDRESS ================= */}
            <div className="order-address">

              <h4>Delivery Address</h4>

              <p>{addr.fullName}</p>
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.state}</p>
              <p>{addr.country} - {addr.postalCode}</p>
              <p>{addr.phone}</p>

            </div>

            {/* ================= ACTIONS ================= */}

            {order.trackingUrl && (
              <a href={order.trackingUrl} target="_blank" rel="noreferrer">
                <button className="track-btn">
                  Track Order
                </button>
              </a>
            )}

            {order.status !== "Delivered" &&
              order.status !== "Cancelled" && (

                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowCancelPopup(true);
                  }}
                >
                  Cancel Order
                </button>

              )}

            <button onClick={() => downloadInvoice(order._id)}>
              Download Invoice
            </button>

            {/* ================= ITEMS ================= */}

            <div className="order-items">

              {order.items.map((item, i) => (

                <div
                  key={i}
                  className="order-item"
                  onClick={() => handleProductClick(item)}
                  style={{ cursor: "pointer" }}
                  title="View Product"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />

                  <div className="order-info">

                    <p className="product-name">{item.name}</p>

                    <p>Qty: {item.quantity}</p>

                    <p className="price">₹{item.price}</p>

                    {!item.product && (
                      <p style={{ color: "red", fontSize: "12px" }}>
                        Product no longer available
                      </p>
                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

        );

      })}

      {showCancelPopup && (

        <div className="cancel-modal">

          <div className="cancel-box">

            <h3>Cancel Order</h3>

            {/* SELECT */}
            <select
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                setCustomReason(""); // reset custom input
              }}
            >
              <option value="">Select Reason</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
              <option value="Delivery too slow">Delivery too slow</option>
              <option value="Change of mind">Change of mind</option>
              <option value="Other">Other</option>
            </select>

            {/* CUSTOM INPUT */}
            {cancelReason === "Other" && (
              <textarea
                placeholder="Enter reason..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            {/* ACTIONS */}
            <div className="cancel-actions">

              <button
                onClick={handleCancelOrder}
                disabled={
                  !cancelReason ||
                  (cancelReason === "Other" && !customReason)
                }
              >
                Confirm Cancel
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCancelPopup(false);
                  setCancelReason("");
                  setCustomReason("");
                  setSelectedOrder(null);
                }}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


    </div>




  );

}