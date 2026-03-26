import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmailOtp = async (email, otp) => {

  try {

    await transporter.sendMail({

      from: `"GenXTrends Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your GenXTrends Verification Code",

      html: `

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<style>

body{
margin:0;
padding:0;
background:linear-gradient(135deg,#020617,#0f172a);
font-family: 'Segoe UI', Arial, sans-serif;
color:#e2e8f0;
}

.container{
max-width:600px;
margin:auto;
padding:40px 20px;
}

.card{
background:#0f172a;
border-radius:14px;
padding:40px;
text-align:center;
box-shadow:0 20px 60px rgba(0,0,0,0.6);
border:1px solid #1e293b;
}

.logo{
font-size:28px;
font-weight:bold;
color:#60a5fa;
margin-bottom:20px;
}

.title{
font-size:22px;
margin-bottom:10px;
}

.subtitle{
color:#94a3b8;
font-size:14px;
margin-bottom:25px;
}

.otp-box{
display:inline-block;
padding:18px 28px;
font-size:34px;
letter-spacing:6px;
font-weight:bold;
background:#1e293b;
border-radius:10px;
color:#60a5fa;
border:1px solid #334155;
margin-bottom:20px;
}

.expiry{
font-size:13px;
color:#94a3b8;
margin-bottom:25px;
}

.notice{
font-size:12px;
color:#64748b;
margin-top:30px;
line-height:1.6;
}

.footer{
margin-top:35px;
font-size:12px;
color:#475569;
}

</style>
</head>

<body>

<div class="container">

<div class="card">

<div class="logo">
GenXTrends
</div>

<div class="title">
Verify Your Account
</div>

<div class="subtitle">
Use the verification code below to continue.
</div>

<div class="otp-box">
${otp}
</div>

<div class="expiry">
This code expires in <b>1 minute</b>.
</div>

<div class="notice">
If you did not request this verification code, you can safely ignore this email.  
Your account security is important to us.
</div>

<div class="footer">
© ${new Date().getFullYear()} GenXTrends  
<br/>
Secure Authentication System
</div>

</div>

</div>

</body>
</html>

      `
    });

    console.log("OTP email sent to:", email);

  } catch (err) {

    console.error("EMAIL ERROR:", err);
    throw err;

  }

};