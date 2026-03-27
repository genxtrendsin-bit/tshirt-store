import "../styles/static.css";

export default function PrivacyPolicy() {

  return (
    <div className="legal-page">

      {/* 🔥 HERO */}
      <div className="legal-hero">
        <h1>Privacy Policy</h1>
        <p>Your data is safe with <span>DJKavod</span></p>
      </div>

      {/* 🔥 CONTENT */}
      <div className="legal-container">

        <div className="legal-card">
          <h3>🔐 Information We Collect</h3>
          <p>
            We collect personal information such as your name, email,
            phone number, and address to process orders and improve your experience.
          </p>
        </div>

        <div className="legal-card">
          <h3>📊 How We Use Your Data</h3>
          <p>
            Your data is used to process orders, provide customer support,
            improve our services, and send important updates.
          </p>
        </div>

        <div className="legal-card">
          <h3>🛡️ Data Protection</h3>
          <p>
            We use secure technologies and encryption to protect your personal
            data from unauthorized access or misuse.
          </p>
        </div>

        <div className="legal-card">
          <h3>🤝 Sharing Information</h3>
          <p>
            We do not sell your personal data. Information may be shared only
            with trusted partners such as delivery services and payment gateways.
          </p>
        </div>

        <div className="legal-card">
          <h3>🍪 Cookies</h3>
          <p>
            We use cookies to enhance your browsing experience,
            remember preferences, and analyze site traffic.
          </p>
        </div>

        <div className="legal-card">
          <h3>📧 Communication</h3>
          <p>
            We may send emails regarding your orders, account updates,
            and promotional offers (you can opt out anytime).
          </p>
        </div>

        <div className="legal-card">
          <h3>👤 Your Rights</h3>
          <p>
            You can request to update or delete your personal data
            by contacting our support team.
          </p>
        </div>

        <div className="legal-card">
          <h3>📞 Contact Us</h3>
          <p>
            For privacy-related concerns, contact us at  
            <b> genxtrends.in@gmail.com </b>
          </p>
        </div>

      </div>

    </div>
  );
}