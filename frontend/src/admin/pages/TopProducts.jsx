import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../../utils/axios";

export default function TopProducts() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const res = await api.get("/admin/top-products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">

      <Sidebar />

      <div className="admin-content">

        <h1>🔥 Top Selling Products</h1>

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No data available</p>
        ) : (

          <div className="top-products">

            {products.map((p, i) => (
              <div key={i} className="card">

                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  style={{ width: "100px" }}
                />

                <h3>{p.name}</h3>

                <p>₹{p.price}</p>

                <p>Sold: {p.totalSold}</p>

              </div>
            ))}

          </div>

        )}

      </div>
    </div>
  );
}