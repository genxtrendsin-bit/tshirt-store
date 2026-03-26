// ===== IMPORTS =====
import React, { useState, useEffect } from "react";
import API from "../utils/axios";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

export default function Checkout() {

  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    postalCode: ""
  });

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  // 🔥 COUPON STATES
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);


  // 🔥 COD LOGIC
  const codAllowed = cartItems.every(
    item => item.product?.codAvailable !== false
  );

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
  ];

  useEffect(() => {

    fetchCart();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.addresses?.length > 0) {

      const defaultAddress =
        user.addresses.find(a => a.isDefault) || user.addresses[0];

      setShippingAddress({
        fullName: defaultAddress.fullName || "",
        phone: defaultAddress.phone || "",
        street: defaultAddress.street || "",
        city: defaultAddress.city || "",
        state: defaultAddress.state || "",
        country: defaultAddress.country || "India",
        postalCode: defaultAddress.postalCode || ""
      });

    }

  }, []);

  // ================= FETCH =================

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetchCart();
    fetchCoupons();
  }
}, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCartItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };


  // ================= COUPONS =================
  const fetchCoupons = async () => {
    try {
      const res = await API.get("/coupons");

      // 🔥 ONLY ACTIVE COUPONS
      const activeCoupons = res.data.filter(c => c.isActive);

      setCoupons(activeCoupons);

      // 🔥 AUTO APPLY (SAFE)
      const auto = activeCoupons.find(c => c.isAutoApply);

      if (auto && !appliedCoupon && total > 0) {
        setCouponCode(auto.code);
        applyCoupon(auto.code);
      }

    } catch (err) {
      console.log(err);
    }
  };


  // ================= APPLY =================
  const [couponError, setCouponError] = useState("");

  const applyCoupon = async (customCode) => {

    const codeToUse = (customCode || couponCode || "").trim().toUpperCase();

    // ❌ NO POPUP SPAM
    if (!codeToUse) {
      setCouponError("Enter coupon code");
      return;
    }

    // ❌ PREVENT WRONG TIME CALL
    if (!total || total <= 0) {
      return;
    }

    try {

      setCouponError("");

      const res = await API.post("/coupons/apply", {
        code: codeToUse,
        total
      });

      setDiscount(res.data.discount);
      setAppliedCoupon(res.data.coupon);

    } catch (err) {



      // ✅ NO alert()
      setCouponError(
        err.response?.data?.message || "Invalid coupon"
      );

      setAppliedCoupon(null);
      setDiscount(0);
    }
  };

  // 🔥 REMOVE COUPON
  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setAppliedCoupon(null);
  };



  // ================= TOTAL =================
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const finalTotal = total - discount;

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const validateAddress = () => {
    const { fullName, phone, street, city, state, postalCode } = shippingAddress;

    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      alert("Please fill all fields");
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Invalid phone");
      return false;
    }

    if (!/^[0-9]{6}$/.test(postalCode)) {
      alert("Invalid pincode");
      return false;
    }

    return true;
  };

  /* =========================
     COD ORDER
  ========================= */

  const placeCODOrder = async () => {

    if (!validateAddress()) return;

    try {

      const token = localStorage.getItem("token");

      const ADVANCE = 100;

      /* =========================
         PAY ₹100 VIA RAZORPAY
      ========================= */

      const res = await API.post(
        "/payment/create-order",
        { amount: ADVANCE },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Advance Payment (COD)",
        description: "₹100 advance for COD",
        order_id: order.id,

        handler: async function (response) {

          try {

            /* VERIFY PAYMENT */
            await API.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            /* CREATE ORDER */
            await API.post(
              "/orders/checkout",
              {
                items: cartItems.map(i => ({
                  product: i.product?._id || i.product,
                  quantity: i.quantity,
                  size: i.size || null,
                  color: i.color || null
                })),
                shippingAddress,
                paymentId: response.razorpay_payment_id,
                paymentMethod: "COD",
                paymentDetails: {},

                codAdvancePaid: true,
                codAdvanceAmount: ADVANCE
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Order placed (₹100 advance paid) 🎉");
            navigate("/orders");

          } catch (err) {
            console.log(err);
            alert("Order failed after payment");
          }

        }
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.log(err);
      alert("COD advance failed");
    }

  };

  const placeFreeOrder = async () => {
    try {

      setLoading(true);

      await API.post("/orders/checkout", {
        items: cartItems.map(i => ({
          product: i.product._id,
          quantity: i.quantity,
          size: i.size,
          color: i.color
        })),
        shippingAddress,
        paymentMethod: "FREE",
        paymentDetails: {
          status: "success",
          note: "Free order via coupon"
        },
        // 🔥 ADD THIS
        coupon: appliedCoupon?._id || null,
        discount
      });

      alert("Order placed successfully 🎉");
      navigate("/orders");

    } catch (err) {
      alert("Order failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RAZORPAY
  ========================= */

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payOnline = async () => {

    if (!validateAddress()) return;

    setLoading(true);

    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Payment failed");
      setLoading(false);
      return;
    }

    try {

      const token = localStorage.getItem("token");

      const finalTotal = total - discount;

      const res = await API.post(
        "/payment/create-order",
        { amount: finalTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "GenXTrends",
        order_id: order.id,

        handler: async function (response) {

          try {

            const token = localStorage.getItem("token");

            /* =========================
               STEP 1: VERIFY PAYMENT
            ========================= */

            const verifyRes = await API.post(
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!verifyRes.data.success) {
              alert("Payment verification failed ❌");
              return;
            }

            /* =========================
               🔥 STEP 2: EXTRACT PAYMENT DATA
            ========================= */

            const method = verifyRes.data.method; // upi / card / netbanking

            const paymentDetails = {
              upiId:
                method === "upi"
                  ? verifyRes.data.email || verifyRes.data.contact || null
                  : null,

              cardLast4:
                method === "card"
                  ? verifyRes.data.card?.last4 || null
                  : null,

              cardBrand:
                method === "card"
                  ? verifyRes.data.card?.network || null
                  : null
            };

            const formattedMethod =
              method === "upi"
                ? "UPI"
                : method === "card"
                  ? "CARD"
                  : "ONLINE";

            /* =========================
               STEP 3: CREATE ORDER
            ========================= */

            await API.post(
              "/orders/checkout",
              {
                items: cartItems.map(i => ({
                  product: i.product._id,
                  quantity: i.quantity,
                  size: i.size,
                  color: i.color,
                  price: i.product.price   // 🔥 IMPORTANT
                })),
                shippingAddress,
                paymentId: response.razorpay_payment_id,

                // 🔥 FIXED
                paymentMethod: formattedMethod,
                paymentDetails,

                // 🔥 COUPON (NEW)
                coupon: appliedCoupon?._id || null,
                couponCode: appliedCoupon?.code || null,

                // 🔥 DISCOUNT (NEW)
                discount: discount || 0,

                // 🔥 FINAL AMOUNT (VERY IMPORTANT)
                totalAmount: total - discount
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Order placed successfully 🎉");
            navigate("/orders");

          } catch (err) {

            console.log("FULL ERROR:", err);
            console.log("SERVER ERROR:", err.response);

            alert(err.response?.data?.message || "Order creation failed");

          } finally {
            setLoading(false);
          }

        },

        theme: { color: "#000" }
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.log(err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }

  };

  /* =========================
     MAIN SUBMIT
  ========================= */

  const handlePlaceOrder = () => {

    const finalTotal = total - discount;


    // 🔥 FREE ORDER → DIRECT

    if (finalTotal <= 0) {
      return placeFreeOrder(); // 🔥 STOP HERE
    }

    if (paymentMethod === "COD") {
      placeCODOrder();
    } else {
      payOnline();
    }
  };

  return (

    <div className="checkout-page">

      {/* ITEMS */}
      <div className="checkout-items">

        <h2>Order Items</h2>

        {cartItems.map(item => (

          <div key={item._id} className="checkout-item">

            <img src={item.product.images?.[0]} />

            <div>
              <h3>{item.product.name}</h3>
              <p>Size: {item.size}</p>
              <p>Color: {item.color || "N/A"}</p>
              <p>Qty: {item.quantity}</p>
              <p>₹{item.product.price}</p>
            </div>

          </div>

        ))}

      </div>

      {/* RIGHT SIDE */}
      <div className="checkout-summary">

        <h2>Delivery Address</h2>

        {/* ===== SELECT SAVED ADDRESS ===== */}
        <h3>Select Address</h3>

        <select
          onChange={(e) => {
            const selectedId = e.target.value;

            const user = JSON.parse(localStorage.getItem("user"));

            const selected = user.addresses.find(a => a._id === selectedId);

            if (!selected) return;

            setShippingAddress({
              fullName: selected.fullName || "",
              phone: selected.phone || "",
              street: selected.street || "",
              city: selected.city || "",
              state: selected.state || "",
              country: selected.country || "India",
              postalCode: selected.postalCode || ""
            });
          }}
        >

          <option value="">Select saved address</option>

          {JSON.parse(localStorage.getItem("user"))?.addresses?.map(addr => (

            <option key={addr._id} value={addr._id}>
              {addr.fullName} {addr.isDefault ? "(Default)" : ""}
            </option>

          ))}

        </select>

        {/* ===== MANUAL INPUT ===== */}

        <input
          name="fullName"
          placeholder="Full Name"
          value={shippingAddress.fullName}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={shippingAddress.phone}
          onChange={handleChange}
        />

        <input
          name="street"
          placeholder="Street Address"
          value={shippingAddress.street}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          value={shippingAddress.city}
          onChange={handleChange}
        />

        <select
          name="state"
          value={shippingAddress.state}
          onChange={handleChange}
        >
          <option value="">Select State</option>
          {states.map(s => <option key={s}>{s}</option>)}
        </select>

        <input
          name="postalCode"
          placeholder="Pincode"
          value={shippingAddress.postalCode}
          onChange={handleChange}
        />

        {/* ================= COUPON ================= */}

        <h3>Apply Coupon</h3>

        {/* 🔥 INPUT FIELD */}
        <input
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
        />

        {/* 🔥 DROPDOWN */}
        <select
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        >
          <option value="">Select Coupon</option>

          {coupons
            .filter(c => c.isActive && c.isAutoApply) // 🔥 hide used
            .map(c => (
              <option key={c._id} value={c.code}>
                {c.code} ({c.type === "percentage"
                  ? `${c.value}%`
                  : `₹${c.value}`})
              </option>
            ))}
        </select>

        {couponError && (
          <p className="coupon-error">
  ❌ You already used this coupon
</p>
        )}

        {/* 🔥 BUTTONS */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

          <button onClick={() => applyCoupon()}>
            Apply
          </button>

          {appliedCoupon && (
            <button onClick={removeCoupon}>
              Remove
            </button>
          )}

        </div>

        {/* 🔥 STATUS */}
        {appliedCoupon && (
          <p style={{ color: "green" }}>
            ✅ {appliedCoupon.code} applied
          </p>
        )}

        {/* ===== PAYMENT ===== */}

        <h3 style={{ marginTop: "20px" }}>Payment Method</h3>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="ONLINE">Online Payment</option>

          {codAllowed && (
            <option value="COD">Cash on Delivery</option>
          )}
        </select>

        {paymentMethod === "COD" && (
          <p style={{ color: "#f59e0b", fontSize: "13px" }}>
            ₹100 Advance required (NON-REFUNDABLE)
          </p>
        )}

        {!codAllowed && (
          <p style={{ color: "red", fontSize: "12px" }}>
            COD not available for selected product
          </p>
        )}

        {/* ================= SUMMARY ================= */}

        <h3>Order Summary</h3>

        <p>Subtotal: ₹{total}</p>

        {discount > 0 && (
          <p style={{ color: "green" }}>
            Discount: -₹{discount}
          </p>
        )}

        <p>Delivery: Free</p>

        <hr />

        <h2>Total: ₹{finalTotal}</h2>

        <button onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </button>

      </div>

    </div>

  );

}