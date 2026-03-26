import React, { useEffect, useState, useContext } from "react";
import API from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/cart.css";

export default function Cart() {

  const { fetchCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      fetchCart();
    }
  }, []);

  

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCartItems(res.data);
      fetchCartCount();
    } catch (err) {
      console.log("Cart fetch error:", err);
    }
  };

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;

    try {
      await API.put(`/cart/${id}`, { quantity: qty });
      fetchCart();
    } catch (err) {
      console.log("Update quantity error:", err);
    }
  };

  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.log("Remove item error:", err);
    }
  };

  // ===== NAVIGATION =====
  const handleNavigate = (productId) => {
    if (!productId) return;
    navigate(`/product/${productId}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>

        <Link to="/">
          <button className="continue-btn">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  return (

    <div className="cart-page">

      {/* LEFT SIDE CART ITEMS */}
      <div className="cart-items">

        <h2>Your Cart</h2>

        {cartItems.map(item => {

          const product = item.product;

          // ===== PRODUCT REMOVED CASE =====
          if (!product) {
            return (
              <div key={item._id} className="cart-item removed-item">
                <p style={{ color: "red" }}>
                  This product is no longer available.
                </p>

                <button
                  className="remove"
                  onClick={() => removeItem(item._id)}
                >
                  Remove from cart
                </button>
              </div>
            );
          }

          return (

            <div
              key={item._id}
              className="cart-item"
              onClick={() => handleNavigate(product._id)}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >

              <img
                src={product.images?.[0] || product.image}
                alt={product.name}
              />

              <div className="cart-info">

                <h3>{product.name}</h3>

                <p>Size: {item.size}</p>

                <p>Color: {item.color || "Not selected"}</p>

                <p className="price">
                  ₹{product.price}
                </p>

                <div className="qty">

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent redirect
                      updateQuantity(item._id, item.quantity - 1);
                    }}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ prevent redirect
                      updateQuantity(item._id, item.quantity + 1);
                    }}
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove"
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ prevent redirect
                    removeItem(item._id);
                  }}
                >
                  Remove
                </button>

              </div>

            </div>

          );

        })}

      </div>

      {/* RIGHT SIDE ORDER SUMMARY */}
      <div className="cart-summary">

        <h3>Order Summary</h3>

        <p>Subtotal: ₹{total}</p>

        <p>Delivery: Free</p>

        <hr />

        <h2>Total: ₹{total}</h2>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>

      </div>

    </div>

  );

}