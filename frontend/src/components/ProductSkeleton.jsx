import React from "react";
import "../styles/skeleton.css";

export default function ProductSkeleton() {
  return (
    <div className="skeleton-card">

      <div className="skeleton-img shimmer"></div>

      <div className="skeleton-text shimmer"></div>

      <div className="skeleton-text small shimmer"></div>

    </div>
  );
}