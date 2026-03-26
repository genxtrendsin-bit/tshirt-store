import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/axios";
import { addToCart } from "../services/cartService";
import { CartContext } from "../context/CartContext";
import { addReview, getReviews } from "../services/reviewService";

import ProductRow from "../components/ProductRow";
import Recommendations from "../components/Recommendations";

import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

import "../styles/productDetails.css";

export default function ProductDetails() {

  const { id } = useParams();
  const { fetchCartCount } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const [alsoBought, setAlsoBought] = useState([]);
  const getDeliveryEstimate = () => {

    const today = new Date();

    const minDate = new Date();
    minDate.setDate(today.getDate() + 6);

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    const options = { day: "numeric", month: "short" };

    return `${minDate.toLocaleDateString("en-IN", options)} - ${maxDate.toLocaleDateString("en-IN", options)}`;
  };

  const expressPincodes = [
    "125051", // Ratia
    "125050", // Fatehabad
    "125055", // Sirsa
    "125001", // Hisar
    "125120", // Tohana
    "151501"  // Budhlada
  ];

  const [pincode, setPincode] = useState("");
  const [isExpress, setIsExpress] = useState(false);

  useEffect(() => {

    if (galleryImages?.length) {
      setSelectedImage(galleryImages[0]);
    }

  }, [color]);

  useEffect(() => {

    if (pincode.length === 6) {

      if (expressPincodes.includes(pincode)) {
        setIsExpress(true);
      } else {
        setIsExpress(false);
      }

    }

  }, [pincode]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /* FETCH PRODUCT */

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await API.get(`/products/${id}`);
        setProduct(res.data);

        if (res.data.colors?.length) {
          setColor(res.data.colors[0]);
        }

        if (res.data.sizes?.length) {
          setSize(res.data.sizes[0]);
        }

        if (res.data.images?.length) {
          setSelectedImage(res.data.images[0]);
        }

      } catch (err) {
        console.log(err);
      }

    };

    fetchProduct();

  }, [id]);

  /* FETCH REVIEWS */

  useEffect(() => {

    const fetchReviews = async () => {

      try {

        const data = await getReviews(id);
        setReviews(data);

      } catch (err) {
        console.log(err);
      }

    };

    fetchReviews();

  }, [id]);

  /* ALSO BOUGHT */

  useEffect(() => {

    const fetchAlsoBought = async () => {

      try {

        const res = await API.get(`/recommendations/also-bought/${id}`);
        setAlsoBought(res.data);

      } catch (err) {
        console.log(err);
      }

    };

    fetchAlsoBought();

  }, [id]);

  /* IMAGE FILTER */

  const filteredImages = product?.images?.filter(img =>
    color ? img.toLowerCase().includes(color.toLowerCase()) : true
  );

  const galleryImages =
    filteredImages && filteredImages.length > 0
      ? filteredImages
      : product?.images;

  /* ADD REVIEW */

  const submitReview = async () => {

    try {

      await addReview({
        productId: id,
        rating,
        comment
      });

      alert("Review submitted ⭐");

      setRating(0);
      setComment("");

      const updated = await getReviews(id);
      setReviews(updated);

      const p = await API.get(`/products/${id}`);
      setProduct(p.data);

    } catch (err) {

      alert("Login required");

    }

  };

  /* ADD TO CART */

  const handleAddToCart = async () => {

    if (!size) {
      alert("Please select size");
      return;
    }

    try {

      await addToCart(product._id, size, color, quantity);

      fetchCartCount();

      alert("Added to cart");

    } catch (err) {

      alert("Please login first");

    }

    console.log("ADDING TO CART:", {
      productId: product._id,
      size,
      color,
      quantity
    });

  };

  if (!product) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  return (

    <>

      <div className="product-page">

        {/* IMAGE SECTION */}

        <div className="image-section">

          <InnerImageZoom
            src={selectedImage || galleryImages?.[0]}
            zoomSrc={selectedImage || galleryImages?.[0]}
            zoomType="hover"
            zoomScale={1.8}
          />

          <div className="thumbs">

            {galleryImages?.map((img, index) => (

              <img
                key={index}
                src={img}
                alt="product"
                loading="lazy"
                className={selectedImage === img ? "thumb active" : "thumb"}
                onClick={() => setSelectedImage(img)}
              />

            ))}

          </div>

        </div>

        {/* PRODUCT INFO */}

        <div className="product-info">

          <div className="info-card">

            <h1>{product.name}</h1>

            <p className="price">₹{product.price}</p>

            <div className="rating-box">

              {"⭐".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}

              <span>
                ({product.numReviews || reviews.length} reviews)
              </span>

            </div>

            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-stock">Out of Stock</span>
              )}
            </div>

          </div>

          {/* SIZE */}

          <div className="option-box">

            <h4>Select Size</h4>

            <div className="size-grid">

              {product.sizes?.map(s => (

                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={size === s ? "size-btn active" : "size-btn"}
                >
                  {s}
                </button>

              ))}

            </div>

          </div>

          {/* COLOR */}

          {Array.isArray(product.colors) && product.colors.length > 0 && (

            <div className="option-box">

              <h4>Select Color</h4>

              <div className="color-options">

                {product.colors.map((c, i) => {

                  // 🔥 handle multiple formats
                  const colorValue =
                    typeof c === "string"
                      ? c.toLowerCase()
                      : c?.name?.toLowerCase() || "#ccc";

                  return (
                    <div
                      key={i}
                      onClick={() => setColor(colorValue)}
                      className={`color-swatch ${color === colorValue ? "active" : ""
                        }`}
                      title={colorValue}
                      style={{
                        background: colorValue,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        border:
                          color === colorValue
                            ? "2px solid black"
                            : "1px solid #ccc"
                      }}
                    />
                  );
                })}

              </div>

            </div>

          )}

          {/* QUANTITY */}

          <div className="option-box">

            <h4>Quantity</h4>

            <div className="qty-controls">

              <button
                disabled={quantity === 1}
                onClick={() => setQuantity(quantity - 1)}
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => {
                  if (quantity < product.stock) {
                    setQuantity(quantity + 1);
                  }
                }}
              >
                +
              </button>

            </div>

          </div>

          <button
            className="cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
          </button>

          <div className="product-description-box">

            <h3>Product Description</h3>

            <div className="description-text">

              {product.description
                ?.split(". ")
                .map((line, i) => (
                  <p key={i}>{line}.</p>
                ))}

            </div>
            <hr style={{
              margin: "25px 0",
              borderColor: "rgba(255,255,255,0.1)"
            }} />

          </div>

        </div>

      </div>

      <div className="delivery-box">

        {/* DELIVERY DATE */}
        <div className="delivery-card">

          <div className="icon">🚚</div>

          <div>
            <p className="title">Estimated Delivery</p>
            <p className="value">

              {isExpress ? (
                <>
                  ⚡ Express Delivery <br />
                  <span style={{ fontSize: "12px", opacity: 0.8 }}>
                    Delivered in 2–3 days
                  </span>
                </>
              ) : (
                <>
                  {getDeliveryEstimate()} <br />
                  <span style={{ fontSize: "12px", opacity: 0.7 }}>
                    Standard delivery
                  </span>
                </>
              )}

            </p>


          </div>
          {isExpress && (
            <div className="express-badge">
              ⚡ Express Delivery Available
            </div>
          )}

        </div>

        {/* INDIA TAG */}
        <div className="delivery-card">

          <div className="icon">🌍</div>

          <div>
            <p className="title">Delivery Available</p>
            <p className="value">Across India</p>
          </div>

        </div>

        <div className="delivery-card">
          <div className="icon">🎁</div>
          <div>
            <p className="title">Shipping</p>
            <p className="value">Free Delivery</p>
          </div>
        </div>

        {/* SECURE PAYMENT */}
        <div className="delivery-card">
          <div className="icon">🔒</div>
          <div>
            <p className="title">Secure Payment</p>
            <p className="value">100% Protected</p>
          </div>
        </div>

        {/* QUALITY GUARANTEE */}
        <div className="delivery-card">
          <div className="icon">⭐</div>
          <div>
            <p className="title">Quality</p>
            <p className="value">Premium Fabric</p>
          </div>
        </div>

        <div className="delivery-card">

          <div className="icon">
            {product.codAvailable ? "💵" : "❌"}
          </div>

          <div>
            <p className="title">Cash on Delivery</p>

            <p className="value" style={{
              color: product.codAvailable ? "#22c55e" : "#ef4444"
            }}>
              {product.codAvailable ? "Available" : "Not Available"}
            </p>
          </div>

        </div>

      </div>

      <div className="pincode-box">

        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />

      </div>

      {/* PRODUCT DETAILS */}

      <div className="product-details-section">

        <h2>Product Details</h2>

        <div className="spec-table">

          <div className="spec-row"><span>Brand</span><span>{product.brand || "—"}</span></div>
          <div className="spec-row"><span>Material</span><span>{product.material || "—"}</span></div>
          <div className="spec-row"><span>Fit</span><span>{product.fit || "—"}</span></div>
          <div className="spec-row"><span>Neckline</span><span>{product.neckline || "—"}</span></div>
          <div className="spec-row"><span>Sleeve</span><span>{product.sleeveType || "—"}</span></div>
          <div className="spec-row"><span>Fabric</span><span>{product.fabricWeight || "—"}</span></div>
          <div className="spec-row"><span>Pattern</span><span>{product.pattern || "—"}</span></div>

        </div>

      </div>

      {/* REVIEW FORM */}

      <div className="review-box">

        <h3>Write a Review</h3>

        <div className="stars">

          {[1, 2, 3, 4, 5].map(star => (

            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                fontSize: "26px",
                color: star <= rating ? "gold" : "gray"
              }}
            >
              ⭐
            </span>

          ))}

        </div>

        <textarea
          placeholder="Write review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="review-btn" onClick={submitReview}>
          Submit Review
        </button>

      </div>

      {/* REVIEWS */}

      <div className="reviews-section">

        <h3>Customer Reviews</h3>

        {reviews.length === 0 && <p>No reviews yet</p>}

        {reviews.map(r => (

          <div key={r._id} className="review-card">

            <strong>{r.user?.name}</strong>

            <div className="review-stars">
              {"⭐".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>

            <p>{r.comment}</p>

            {r.adminReply && (

              <div className="admin-reply">
                <strong>Store Reply</strong>
                <p>{r.adminReply}</p>
              </div>

            )}

            <small className="review-date">
              {new Date(r.createdAt).toLocaleDateString()}
            </small>

          </div>

        ))}

      </div>

      {/* ALSO BOUGHT */}

      <div className="recommend-section">

        <ProductRow
          title="Customers also bought"
          products={alsoBought}
        />

      </div>

      {/* AI RECOMMENDATIONS */}

      <div className="recommend-section">

        <Recommendations productId={product._id} />

      </div>

    </>

  );


}