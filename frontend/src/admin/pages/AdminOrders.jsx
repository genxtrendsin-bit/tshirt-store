// ===== IMPORTS =====
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/axios";
import useAdminFilter from "../hooks/useAdminFilter";
import AdminFilterBar from "../components/AdminFilterBar";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);

  const navigate = useNavigate();

  const downloadShippingInvoice = async (orderId) => {
    try {

      const res = await API.get(
        `/orders/admin/${orderId}/shipping-invoice`,
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `shipping_invoice_${orderId}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Shipping invoice error:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/admin-orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* 🔥 FIXED: FILTER HOOK (BEFORE RETURN) */
  const {
    filteredData: filteredOrders,
    search,
    setSearch,
    month,
    setMonth
  } = useAdminFilter(orders);

  const updateOrder = async (orderId, data) => {
    try {
      await API.put(`/orders/admin/update-status/${orderId}`, data);
      fetchOrders();
    } catch {
      alert("Update failed");
    }
  };

  const processRefund = async (order) => {

    if (!window.confirm("Process refund for this order?")) return;

    try {

      await API.post("/payment/refund", {
        orderId: order._id,
        paymentId: order.paymentId,
        amount: order.totalPrice
      });

      alert("Refund processed ✅");
      fetchOrders();

    } catch (err) {

      console.log(err);
      alert("Refund failed ❌");

    }

  };

  const handleProductClick = (item) => {
    const productId = item.product?._id || item.product;
    if (!productId) return alert("Product no longer available");
    navigate(`/product/${productId}`);
  };

  const handleUserClick = (userId) => {
    if (!userId) return;
    navigate(`/admin/user/${userId}/orders`);
  };

  /* STATUS COLOR */
  const getStatusColor = (status) => {
    if (status === "Delivered") return "green";
    if (status === "Cancelled") return "red";
    if (status === "Shipped") return "blue";
    return "orange";
  };

  return (

    <div style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>

      <h1>All Orders</h1>

      {/* 🔥 FILTER BAR */}
      <AdminFilterBar
        search={search}
        setSearch={setSearch}
        month={month}
        setMonth={setMonth}
      />

      {!filteredOrders.length && (
        <p style={{ marginTop: "20px" }}>No orders found</p>
      )}

      {filteredOrders.map(order => {
        const method = order.paymentMethod || "ONLINE";

        const upi = order.paymentDetails?.upiId;
        const cardLast4 = order.paymentDetails?.cardLast4;
        const cardBrand = order.paymentDetails?.cardBrand;

        const addr = order.shippingAddress || {};

        const refundStatus =
          order.refund?.status ||
          (order.status === "Cancelled" ? "Pending" : "Not Applicable");

        const pendingAmount =
          order.pendingAmount ??
          (order.paymentMethod === "COD"
            ? order.totalPrice - (order.codAdvanceAmount || 0)
            : 0);

        const isPendingPayment = pendingAmount > 0;

        return (

          <div
            key={order._id}
            className="card"
            style={{
              marginBottom: "20px",

              /* 🔥 HIGHLIGHT UNPAID */
              border: isPendingPayment ? "1px solid #f59e0b" : "1px solid #333",
              background: isPendingPayment
                ? "rgba(245,158,11,0.05)"
                : "transparent"
            }}
          >

            {/* ================= BASIC INFO ================= */}

            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                setOpenOrder(openOrder === order._id ? null : order._id)
              }
            >

              <p><b>Order ID:</b> {order._id}</p>

              <p
                style={{ cursor: "pointer", color: "#60a5fa" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick(order.user?._id);
                }}
              >
                <b>User:</b> {order.user?.name}
              </p>

              <p><b>Email:</b> {order.user?.email}</p>

              <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>

              <p>
                <b>Status:</b>{" "}
                <span style={{
                  color: "white",
                  background: getStatusColor(order.status),
                  padding: "3px 8px",
                  borderRadius: "6px",
                  fontSize: "12px"
                }}>
                  {order.status}
                </span>
              </p>

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

              <p><b>Total:</b> ₹{order.totalPrice}</p>

              {/* 🔥 PAYMENT DETAILS */}


              <p>
                <b>Method:</b>{" "}
                <span className="method-badge">
                  {method}
                </span>
              </p>

              {/* 🔥 UPI */}
              {upi && (
                <p>
                  <b>UPI:</b> {upi}
                </p>
              )}

              {/* 🔥 CARD */}
              {cardLast4 && (
                <p>
                  <b>Card:</b> {cardBrand || ""} •••• {cardLast4}
                </p>
              )}

              {/* 🔥 COD */}
              {method === "COD" && (
                <p style={{ color: "#f59e0b" }}>
                  Cash on Delivery
                </p>
              )}

              {/* 🔥 COD BREAKDOWN */}
              {order.paymentMethod === "COD" ? (

                <>
                  <p style={{ color: "#22c55e" }}>
                    Paid: ₹{order.paidAmount ?? order.codAdvanceAmount ?? 0}
                  </p>

                  {order.pendingAmount > 0 && (
                    <p style={{ color: "#f59e0b", fontWeight: "600" }}>
                      Pending: ₹{pendingAmount}
                    </p>
                  )}
                </>

              ) : (

                <p style={{ color: "#22c55e" }}>
                  Fully Paid
                </p>

              )}

              {/* CANCEL REASON */}
              {order.status === "Cancelled" && order.cancelReason && (
                <p style={{ marginTop: "6px" }}>
                  <b>Cancel Reason:</b>{" "}
                  <span style={{
                    color: "#f87171",
                    fontStyle: "italic"
                  }}>
                    {order.cancelReason}
                  </span>
                </p>
              )}

              {/* REFUND */}
              <p>
                <b>Refund:</b>{" "}
                <span style={{
                  color:
                    refundStatus === "Completed" ? "green" :
                      refundStatus === "Pending" ? "orange" :
                        "gray"
                }}>
                  {refundStatus}
                </span>
              </p>

            </div>

            {/* ================= EXPANDED ================= */}

            {openOrder === order._id && (

              <div style={{ marginTop: "20px" }}>

                <h4>Delivery Address</h4>

                <p>{addr.fullName}</p>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state}</p>
                <p>{addr.country} - {addr.postalCode}</p>
                <p>Phone: {addr.phone}</p>

                {/* ================= PAYMENT ACTION ================= */}

                {order.paymentMethod === "COD" && order.pendingAmount > 0 && (

                  <button
                    style={{
                      marginTop: "15px",
                      background: "#22c55e",
                      color: "white"
                    }}
                    onClick={() =>
                      updateOrder(order._id, {
                        pendingAmount: 0,
                        paidAmount: order.totalPrice,
                        paymentStatus: "Paid"
                      })
                    }
                  >
                    Mark as Paid
                  </button>

                )}

                {/* ================= STATUS UPDATE ================= */}

                <div style={{ marginTop: "15px" }}>
                  <label>Status:</label>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrder(order._id, { status: e.target.value })
                    }
                    style={{ marginLeft: "10px" }}
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Shipped</option>
                    <option>Out for Delivery</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                </div>

                {/* ================= REFUND ================= */}

                {order.status === "Cancelled" &&
                  order.paymentId &&
                  order.refund?.status !== "Completed" && (

                    <button
                      style={{
                        marginTop: "15px",
                        background: "red",
                        color: "white",
                        opacity: order.refund?.status === "Processing" ? 0.6 : 1
                      }}
                      disabled={order.refund?.status === "Processing"}
                      onClick={() => processRefund(order)}
                    >
                      {order.refund?.status === "Processing"
                        ? "Processing..."
                        : "Process Refund"}
                    </button>

                  )}

                {/* ================= TRACKING ================= */}

                <div style={{ marginTop: "10px" }}>
                  <label>Tracking ID:</label>
                  <input
                    defaultValue={order.trackingId || ""}
                    onBlur={(e) =>
                      updateOrder(order._id, {
                        trackingId: e.target.value
                      })
                    }
                  />
                </div>

                <div style={{ marginTop: "10px" }}>
                  <label>Tracking URL:</label>
                  <input
                    defaultValue={order.trackingUrl || ""}
                    style={{ width: "300px" }}
                    onBlur={(e) =>
                      updateOrder(order._id, {
                        trackingUrl: e.target.value
                      })
                    }
                  />
                </div>

                <button onClick={() => downloadShippingInvoice(order._id)}>
                  📦 Print Invoice
                </button>

                {/* ================= ITEMS ================= */}

                <h4 style={{ marginTop: "20px" }}>Items</h4>

                {order.items.map((item, index) => (

                  <div
                    key={index}
                    onClick={() => handleProductClick(item)}
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                      cursor: "pointer",
                      alignItems: "center"
                    }}
                  >

                    <img src={item.image} width="60" alt={item.name} />

                    <div>
                      <p>{item.name}</p>

                      <p>Qty: {item.quantity}</p>

                      {item.size && (
                        <p>
                          Size:{" "}
                          <span style={{
                            background: "rgba(99,102,241,0.2)",
                            padding: "2px 8px",
                            borderRadius: "6px",
                            fontSize: "12px"
                          }}>
                            {item.size}
                          </span>
                        </p>
                      )}

                      {item.color && (
                        <p>
                          Color:{" "}
                          <span style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            background: item.color.toLowerCase(),
                            color: "white"
                          }}>
                            {item.color}
                          </span>
                        </p>
                      )}

                      <p>₹{item.price}</p>
                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        );

      })}

    </div>

  );

}