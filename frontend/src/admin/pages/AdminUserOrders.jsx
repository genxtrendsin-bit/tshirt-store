// ===== IMPORTS =====
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../utils/axios";

export default function AdminUserOrders() {

  const { userId } = useParams();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [openOrder, setOpenOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* FETCH USER ORDERS */

  useEffect(() => {

    const fetchUserOrders = async () => {

      try {

        const res = await API.get(`/orders/admin-orders`);

        // Filter only this user's orders
        const userOrders = res.data.filter(
          (order) => order.user?._id === userId
        );

        setOrders(userOrders);

      } catch (err) {

        console.log(err);

      } finally {
        setLoading(false);
      }

    };

    fetchUserOrders();

  }, [userId]);

  /* PRODUCT CLICK */

  const handleProductClick = (item) => {

    const productId = item.product?._id || item.product;

    if (!productId) {
      alert("Product no longer available");
      return;
    }

    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  if (!orders.length) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No orders found for this user</h2>
      </div>
    );
  }

  return (

    <div style={{ padding: "40px", maxWidth: "1100px", margin: "auto" }}>

      <h1>User Orders</h1>

      {orders.map(order => {

        const addr = order.shippingAddress || {};

        return (

          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px"
            }}
          >

            {/* ORDER HEADER */}

            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                setOpenOrder(openOrder === order._id ? null : order._id)
              }
            >

              <p><b>Order ID:</b> {order._id}</p>

              <p>
                <b>Date:</b>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <p><b>Status:</b> {order.status}</p>

              <p><b>Total:</b> ₹{order.totalPrice}</p>

            </div>

            {/* EXPANDED */}

            {openOrder === order._id && (

              <div style={{ marginTop: "20px" }}>

                <h4>Delivery Address</h4>

                <p>{addr.fullName}</p>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state}</p>
                <p>{addr.country} - {addr.postalCode}</p>
                <p>Phone: {addr.phone}</p>

                {/* ITEMS */}

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
                    title="View Product"
                  >

                    <img
                      src={item.image}
                      width="60"
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />

                    <div>

                      <p>{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.price}</p>

                      {!item.product && (
                        <p style={{ color: "red", fontSize: "12px" }}>
                          Product no longer available
                        </p>
                      )}

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