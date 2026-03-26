import "../styles/static.css";

export default function Terms() {

  return (
    <div className="legal-page">

      {/* 🔥 HERO */}
      <div className="legal-hero">
        <h1>Terms & Conditions</h1>
        <p>Welcome to <span>GenXTrends</span></p>
      </div>

      {/* 🔥 CONTENT */}
      <div className="legal-container">

        <div className="legal-card">
          <h3>🛒 Use of Website</h3>
          <p>
            By accessing GenXTrends, you agree to use our services for lawful
            purposes only and comply with all applicable laws.
          </p>
        </div>

        <div className="legal-card">
          <h3>👤 User Accounts</h3>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and password. Any activity under your account is your responsibility.
          </p>
        </div>

        <div className="legal-card">
          <h3>💳 Payments</h3>
          <p>
            We support secure online payments and Cash on Delivery (COD).
            Orders will be processed only after successful payment or confirmation.
          </p>
        </div>

        <div className="legal-card">
          <h3>📦 Shipping & Delivery</h3>
          <p>
            Orders are delivered within 3–7 business days. Delays may occur
            due to external factors like weather or logistics issues.
          </p>
        </div>

        <div className="legal-card">
          <h3>🔄 Returns & Refunds</h3>
          <p>
            Products can be returned within 7 days if damaged or incorrect. You have to Contact our Team for Return.
            Refunds are processed after inspection.
          </p>
        </div>

        <div className="legal-card">
          <h3>🚫 Prohibited Activities</h3>
          <p>
            Misuse of the platform, fraudulent activity, or abuse may result
            in account suspension or permanent ban. We also take Legal action against him/her.
          </p>
        </div>

        <div className="legal-card">
          <h3>⚖️ Limitation of Liability</h3>
          <p>
            GenXTrends is not liable for indirect or incidental damages arising
            from use of our platform.
          </p>
        </div>

        <div className="legal-card">
          <h3>📞 Contact Us</h3>
          <p>
            For any questions, contact us at <b>support@genxtrends.in</b>
          </p>
        </div>

      </div>

    </div>
  );
}