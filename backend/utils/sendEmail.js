import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailData = {
      to: [{ email: to }],
      sender: {
        email: process.env.EMAIL_USER,
        name: process.env.STORE_NAME || "DJKavod",
      },
      subject,
      htmlContent: html,
    };

    const response = await apiInstance.sendTransacEmail(emailData);

    console.log("✅ Email sent:", response.messageId);

  } catch (err) {
    console.error(
      "❌ EMAIL ERROR:",
      err.response?.body || err.message
    );
  }
};