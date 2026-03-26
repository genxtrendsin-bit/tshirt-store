// ===== IMPORTS =====
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/wishlistService";

export default function Wishlist() {

    // ===== STATE =====
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    // ===== FETCH WISHLIST =====
    useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetchWishlist();
  }
}, []);

    const fetchWishlist = async () => {
        try {
            const data = await getWishlist();
            setItems(data);
        } catch (err) {
            console.log(err);
        }
    };

    // ===== REMOVE ITEM =====
    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);

            // update UI instantly
            setItems(prev =>
                prev.filter(item => item.product?._id !== productId)
            );

        } catch (err) {
            console.log(err);
        }
    };

    // ===== NAVIGATION =====
    const handleNavigate = (productId) => {
        if (!productId) return;
        navigate(`/product/${productId}`);
    };

    // ===== UI =====
    return (

        <div style={{ padding: "40px" }}>

            <h1>My Wishlist ❤️</h1>

            {items.length === 0 && <p>No items in wishlist</p>}

            {items.map(item => {

                const product = item.product;

                // safety check
                if (!product) return null;

                return (

                    <div
                        key={item._id}
                        onClick={() => handleNavigate(product._id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "20px",
                            marginBottom: "20px",
                            borderBottom: "1px solid #333",
                            paddingBottom: "10px",
                            cursor: "pointer",
                            transition: "transform 0.2s ease"
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    >

                        <img
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            style={{
                                width: "120px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: "8px"
                            }}
                        />

                        <div>

                            <h3>{product.name}</h3>

                            <p>₹{product.price}</p>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // ✅ prevent redirect
                                    handleRemove(product._id);
                                }}
                                style={{
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    borderRadius: "4px"
                                }}
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                );
            })}

        </div>

    );

}