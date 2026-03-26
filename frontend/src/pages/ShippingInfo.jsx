import "../styles/static.css";

export default function ShippingInfo() {

  return (
    <div className="legal-page">

      {/* 🔥 HERO */}
      <div className="legal-hero">
        <h1>Shipping Information</h1>
        <p>Fast & Reliable Delivery by <span>GenXTrends</span></p>
      </div>

      {/* 🔥 CONTENT */}
      <div className="legal-container">

        <div className="legal-card">
          <h3>🚚 Delivery Time</h3>
          <p>
            Orders are processed within 24–48 hours. Delivery usually takes
            3–7 business days depending on your location.
          </p>
        </div>

        <div className="legal-card">
          <h3>📦 Shipping Charges</h3>
          <p>
            Enjoy <b>Free Shipping</b> on all orders across India.
          </p>
        </div>

        <div className="legal-card">
          <h3>💳 Cash on Delivery (COD)</h3>
          <p>
            COD is available. A small advance may be required for order confirmation.
            This amount is non-refundable if the order is cancelled by the user.
          </p>
        </div>

        <div className="legal-card">
          <h3>📍 Order Tracking</h3>
          <p>
            Once your order is shipped, you will receive a tracking ID
            to monitor your delivery in real-time.
          </p>
        </div>

        <div className="legal-card">
          <h3>🔄 Return Shipping</h3>
          <p>
            If delivery fails or the product is not received,
            it will be automatically returned to our warehouse.
          </p>
        </div>

        <div className="legal-card">
          <h3>⚠️ Damaged or Wrong Product</h3>
          <p>
            If you receive a damaged or incorrect product,
            please contact our support team immediately for assistance.
          </p>
        </div>

      </div>

    </div>
  );
}