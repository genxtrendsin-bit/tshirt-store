import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import ProductCard from "../components/ProductCard";
import "../styles/product.css";

export default function TopProductsUser() {

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const res = await API.get("/products/top-products");
      setProducts(res.data);
    } catch (err) {
      console.error("Top products error:", err);
    }
  };

  return (
    <div className="container">

      <h1>🔥 Trending Deals</h1>

      <div className="product-grid">

        {products.length === 0 ? (
          <p>No deals available</p>
        ) : (

          products.map((p) => (

            <div
              key={p.productId}
              onClick={() => navigate(`/product/${p.productId}`)}
              style={{ cursor: "pointer" }}
            >
              <ProductCard
                product={{
                  _id: p.productId,
                  name: p.name,
                  price: p.price,
                  images: p.images
                }}
              />
            </div>

          ))

        )}

      </div>

    </div>
  );
}