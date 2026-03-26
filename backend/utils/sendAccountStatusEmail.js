import SibApiV3Sdk from "sib-api-v3-sdk";

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
    const client = SibApiV3Sdk.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const subject = isBanned
      ? "🚫 Account Suspended | GenXTrends"
      : "✅ Account Restored | GenXTrends";

    const htmlContent = isBanned
      ? generateTemplate({
          title: "Account Suspended",
          color: "#ef4444",
          message: `
            Your account has been <b>suspended</b> due to policy violations.<br/><br/>
            If you believe this is a mistake, please contact our support team.<br/><br/>

            <a href="mailto:support@genxtrends.com">Contact Support</a>
          `
        })
      : generateTemplate({
          title: "Account Restored",
          color: "#22c55e",
          message: `
            Good news! Your account has been <b>restored</b>.<br/><br/>
            You can now continue shopping on GenXTrends.<br/><br/>

            <a href="mailto:support@genxtrends.com">Contact Support</a>
          `
        });

    const emailData = {
      to: [{ email }],
      sender: {
        email: process.env.EMAIL_USER,
        name: "GenXTrends Support",
      },
      subject,
      htmlContent,
    };

    const response = await apiInstance.sendTransacEmail(emailData);

    console.log(`📧 Account status email sent to ${email}`, response.messageId);

  } catch (err) {
    console.error(
      "❌ EMAIL ERROR:",
      err.response?.body || err.message
    );
  }
};