import nodemailer from "nodemailer";

/* ==========================
   TRANSPORTER (MODERN)
========================== */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ==========================
   HTML TEMPLATE
========================== */

const generateTemplate = ({ title, message, color }) => {
  return `
  <div style="
    font-family: Arial, sans-serif;
    background: #f4f4f4;
    padding: 30px;
  ">
    <div style="
      max-width: 500px;
      margin: auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    ">

      <div style="
        background: ${color};
        color: #fff;
        padding: 20px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
      ">
        ${title}
      </div>

      <div style="padding: 25px; color: #333;">
        <p style="font-size: 16px; line-height: 1.6;">
          ${message}
        </p>

        <hr style="margin: 20px 0;" />

        <p style="font-size: 12px; color: #777;">
          If you have any questions, contact our support team.
        </p>

        <p style="font-size: 12px; color: #999;">
          – GenXTrends Team
        </p>
      </div>

    </div>
  </div>
  `;
};

/* ==========================
   MAIN FUNCTION
========================== */

export const sendAccountStatusEmail = async (email, isBanned) => {

  try {

    const subject = isBanned
      ? "🚫 Account Suspended | GenXTrends"
      : "✅ Account Restored | GenXTrends";

    const html = isBanned
      ? generateTemplate({
          title: "Account Suspended",
          color: "#ef4444",
          message: `
            Your account has been <b>suspended</b> due to policy violations.<br/><br/>
            If you believe this is a mistake, please contact our support team.

            <a href="mailto:support@genxtrends.com">Contact Support</a>
          `
        })
      : generateTemplate({
          title: "Account Restored",
          color: "#22c55e",
          message: `
            Good news! Your account has been <b>restored</b>.<br/><br/>
            You can now continue shopping on GenXTrends.

            <a href="mailto:support@genxtrends.com">Contact Support</a>
          `
        });

    await transporter.sendMail({
      from: `"GenXTrends Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html
    });

    console.log(`📧 Account status email sent to ${email}`);

  } catch (err) {

    console.error("EMAIL ERROR:", err);

  }

};