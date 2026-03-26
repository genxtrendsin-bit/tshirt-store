import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import ProductRow from "../components/ProductRow";
import Hero from "../components/Hero";
import FeaturedSlider from "../components/FeaturedSlider";
import API from "../utils/axios";
import "../styles/product.css";
import { motion } from "framer-motion";
import ProductSkeleton from "../components/ProductSkeleton";

export default function Home() {

  const [products, setProducts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // ===== FETCH PRODUCTS =====
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.log("Products error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ===== FETCH TRENDING =====
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoadingTrending(true);
        const res = await API.get("/recommendations/trending");
        setTrending(res.data);
      } catch (err) {
        console.log("Trending error:", err);
      } finally {
        setLoadingTrending(false);
      }
    };
    fetchTrending();
  }, []);

  // ===== FETCH TOP PRODUCTS =====
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await API.get("/products/top-products");
        setTopProducts(res.data);
      } catch (err) {
        console.log("Top products error:", err);
      }
    };
    fetchTopProducts();
  }, []);

  // ===== MEMOIZED FILTERS (PERFORMANCE) =====
  const todaysDeals = useMemo(() => {
    return products.filter(p => p.price < 1000).slice(0, 4);
  }, [products]);

  const featured = useMemo(() => {
    return products.slice(0, 6);
  }, [products]);

  return (
    <div className="container">

      {/* HERO */}
      <Hero />

      {/* ================= TODAY'S DEALS ================= */}
      <div style={{ marginBottom: "50px" }}>


        <h2 className="section-title" style={{ marginBottom: "25px" }}>
          🔥 Today's Deals
        </h2>

        <div className="product-grid">
          {loading
            ? Array(4).fill(0).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
            : todaysDeals.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          }
        </div>
      </div>
      {/* ================= TRENDING ================= */}
      <div style={{ marginBottom: "50px" }}>
        {loadingTrending ? (
          <div className="section">
            <h2 style={{ marginBottom: "50px" }}>
              🔥 Trending This Week
            </h2>

            <div className="product-grid">
              {Array(4).fill(0).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          <ProductRow
            title="🔥 Trending This Week"
            products={trending}
          />
        )}
      </div>

      {/* ================= TOP PRODUCTS ================= */}
      <div style={{ marginBottom: "50px" }}>
        {topProducts.length > 0 && (
          <ProductRow
            title="⭐ Top Selling Products" style={{ marginBottom: "50px" }}
            products={topProducts}
          />
        )}
      </div>

      {/* ================= FEATURED ================= */}
      <div style={{ marginBottom: "50px" }}>
        <div className="section" style={{ marginBottom: "50px" }}>
          {loading ? (
            <div className="product-grid">
              {Array(6).fill(0).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : (
            <FeaturedSlider products={featured} />
          )}
        </div>
      </div>

      {/* ================= ALL PRODUCTS ================= */}
      <h2 id="products" className="section-title">
        All Products
      </h2>

      <div className="product-grid">

        {loading
          ? Array(8).fill(0).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
          : products.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.04
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        }

      </div>

    </div>
  );
}