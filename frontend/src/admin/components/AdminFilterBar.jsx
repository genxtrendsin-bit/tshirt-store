import React from "react";

export default function AdminFilterBar({
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
}) {

  return (

    <div className="admin-filter-bar">

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search by name, email, ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* 📅 MONTH */}
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">All Months</option>

        {[
          "Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"
        ].map((m, i) => (
          <option key={i} value={i + 1}>
            {m}
          </option>
        ))}
      </select>

      {/* 🔥 STATUS FILTER (OPTIONAL) */}
      {setStatus && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Processing">Processing</option>
        </select>
      )}

      {/* 📆 DATE RANGE */}
      {setFromDate && (
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      )}

      {setToDate && (
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      )}

    </div>

  );

}