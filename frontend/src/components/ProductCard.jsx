import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { WishlistContext } from "../context/WishlistContext";
import {
  addToWishlist,
  removeFromWishlist
} from "../services/wishlistService";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {

  const { wishlist, fetchWishlist } = useContext(WishlistContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isWishlisted = wishlist.some(
    (item) => item._id === product._id
  );

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (loading) return;

    try {
      setLoading(true);

      if (isWishlisted) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }

      await fetchWishlist();

    } catch {
      alert("Login required");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-card">

      {/* ❤️ Wishlist */}
      <button
        className="wishlist-btn"
        onClick={(e) => handleWishlist(e)}
      >
        {isWishlisted ? "❤️" : "🤍"}
      </button>

      {/* 🖼 Image */}
      <Link to={`/product/${product._id}`} className="product-image">
        <img
          src={product.images?.[0] || product.image}
          alt={product.name}
        />
      </Link>

      {/* 📦 Info */}
      <div className="product-info">

        {/* Variants */}
        <p className="variants">
          +{product.colors?.length || 3} colors/patterns
        </p>

        {/* Title */}
        <p className="product-name">
          {product.name}
        </p>

        {/* ⭐ Rating */}
        <div className="rating">
          ⭐ {product.rating || 1}
          <span>({product.numReviews || 0})</span>
        </div>

        {/* 💰 Price */}
        <div className="price-box">
          <span className="price">₹{product.price}</span>
          {product.oldPrice && (
            <>
              <span className="mrp">₹{product.oldPrice}</span>
              <span className="off">
                ({Math.round(
                  ((product.oldPrice - product.price) /
                    product.oldPrice) *
                  100
                )}% off)
              </span>
            </>
          )}
        </div>

        {/* 🚚 Delivery */}
        <p className="delivery">
          FREE delivery
        </p>

        {/* 🛒 Button */}
        <button
          className="cart-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}