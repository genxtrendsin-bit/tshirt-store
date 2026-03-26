// ===== IMPORTS =====
import React, { useEffect, useState } from "react";
import API from "../../utils/axios";
import useAdminFilter from "../hooks/useAdminFilter";
import AdminFilterBar from "../components/AdminFilterBar";

export default function RefundLogs() {

  const [logs, setLogs] = useState([]);

  // ===== FETCH =====
  const fetchLogs = async () => {
    try {
      const res = await API.get("/payment/admin/refund-logs");
      setLogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // ===== FILTER =====
  const {
    filteredData,
    search,
    setSearch,
    month,
    setMonth,
    status,
    setStatus,
    fromDate,
    setFromDate,
    toDate,
    setToDate
  } = useAdminFilter(logs);

  // ===== TOTAL REFUND CALCULATION =====
  const totalRefunded = logs.reduce((sum, log) => {
    return sum + (log.amount || 0);
  }, 0);

  const formattedTotal = totalRefunded.toLocaleString("en-IN");

  // ===== STATUS COLOR =====
  const getStatusColor = (status) => {
    if (status === "Completed") return "#22c55e";
    if (status === "Failed") return "#ef4444";
    if (status === "Processing") return "#f59e0b";
    return "#64748b";
  };

  return (

    <div className="admin-page container">

      <h1>Refund Logs</h1>

      {/* ===== TOTAL SUMMARY ===== */}
      <div className="refund-summary">
        <h3>Total Refunded</h3>
        <h1>₹{formattedTotal}</h1>
        <p>{logs.length} refunds processed</p>
      </div>

      {/* ===== FILTER ===== */}
      <AdminFilterBar
        search={search}
        setSearch={setSearch}
        month={month}
        setMonth={setMonth}
        status={status}
        setStatus={setStatus}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />

      {!filteredData.length && (
        <p style={{ marginTop: "20px" }}>
          No refund logs found
        </p>
      )}

      {filteredData.map(log => {

        const method = log.paymentMethod?.toLowerCase();

        return (

          <div key={log._id} className="card" style={{ marginBottom: "15px" }}>

            {/* ORDER + USER */}
            <div style={{ marginBottom: "10px" }}>
              <p><b>Order ID:</b> {log.orderId?._id || "N/A"}</p>
              <p><b>User:</b> {log.userId?.name || "N/A"}</p>
              <p><b>Email:</b> {log.userId?.email || "N/A"}</p>
            </div>

            {/* PAYMENT */}
            <div style={{ marginBottom: "10px" }}>
              <p><b>Amount:</b> ₹{log.amount}</p>
              <p><b>Payment:</b> {log.paymentMethod || "N/A"}</p>

              {method === "upi" && (
                <p><b>UPI:</b> {log.paymentDetails?.upiId || "N/A"}</p>
              )}

              {method === "card" && (
                <p>
                  <b>Card:</b>{" "}
                  {log.paymentDetails?.cardBrand || ""} ••••
                  {log.paymentDetails?.cardLast4 || ""}
                </p>
              )}
            </div>

            {/* REFUND */}
            <div style={{ marginBottom: "10px" }}>
              <p><b>Refund ID:</b> {log.refundId || "N/A"}</p>

              <p>
                <b>Status:</b>{" "}
                <span
                  style={{
                    background: getStatusColor(log.status),
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    fontSize: "12px"
                  }}
                >
                  {log.status}
                </span>
              </p>
            </div>

            {/* DATE */}
            <p className="text-muted" style={{ fontSize: "13px" }}>
              <b>Date:</b>{" "}
              {log.createdAt
                ? new Date(log.createdAt).toLocaleString()
                : "N/A"}
            </p>

          </div>

        );

      })}

    </div>

  );

}