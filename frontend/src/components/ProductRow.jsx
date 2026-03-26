import React from "react";
import ProductCard from "./ProductCard";

export default function ProductRow({ title, products }) {

  if (!products || products.length === 0) return null;

  return (
    <div className="product-row-section">

      <h2 style={{ marginBottom: "30px" }}>
  {title}
</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            window.innerWidth < 768
              ? "repeat(2, 1fr)"   // mobile
              : "repeat(4, 1fr)",  // desktop
          gap: "20px"
        }}
      >
        {products.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

    </div>
  );
}