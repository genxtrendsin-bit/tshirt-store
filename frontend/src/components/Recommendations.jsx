import React, { useEffect, useState, useRef } from "react";
import API from "../utils/axios";
import ProductCard from "./ProductCard";

export default function Recommendations({ productId }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowRef = useRef();

  useEffect(() => {
    if (productId) {
      fetchRecommendations();
    }
  }, [productId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/recommendations/similar/${productId}`);
      setProducts(res.data);

    } catch (err) {
      console.log("Recommendation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Scroll controls
  const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    rowRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  if (!loading && products.length === 0) return null;

  return (
    <div className="section">

      {/* HEADER WITH ARROWS */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h2 className="section-title">Recommended Products</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={scrollLeft} className="nav-btn">←</button>
          <button onClick={scrollRight} className="nav-btn">→</button>
        </div>
      </div>

      {/* PRODUCT ROW */}
      <div className="product-row" ref={rowRef}>

        {loading
          ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="product-card skeleton" />
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
        }

      </div>

    </div>
  );
}