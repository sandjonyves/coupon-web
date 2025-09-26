const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure the email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // utile pour Render/serveurs cloud
  },
});

// Check if email service is configured
const isEmailConfigured = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return false;
  return true;
};

// Function to send coupon received email
const sendCouponReceivedEmail = async (couponId, couponData) => {
  if (!isEmailConfigured()) {
    console.log("❌ Email service not configured");
    return { success: false, message: "Email service not configured" };
  }

  // Generate codes section
  const generateCodesSection = () => {
    const codes = [];
    const codeInfos = ["code1", "code2", "code3", "code4"];

    codeInfos.forEach((key, i) => {
      const value = couponData[key];
      if (!value) return;

      const valid = couponData[`${key}Valid`];
      const status = valid ? "✅ Valide" : "❌ Invalide";
      const color = valid ? "#28a745" : "#dc3545";

      codes.push(`
        <div style="display: flex; justify-content: space-between; align-items: center;
             padding: 10px; border: 1px solid #dee2e6; border-radius: 5px; margin-bottom: 8px; background: #f8f9fa;">
          <div><strong style="color: #555;">Code ${i + 1}:</strong></div>
          <div><span style="color: ${color}; font-weight: bold;">${status}</span></div>
        </div>
      `);
    });

    return codes.join("");
  };

  // Mail options
  const mailOptions = {
    from: `"Requête de Vérification - Platform Web Test" <${process.env.SMTP_USER}>`,
    to: couponData.email,
    subject: `Confirmation de vérification de coupon - Platform Web Test`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; padding: 30px; border-radius: 15px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Platform Web Test</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 15px;
          margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <p style="color: #666; line-height: 1.6;">
            Type De Coupon: ${couponData.type}<br>
            Montant du Coupon: ${couponData.montant} ${couponData.devise}<br>
          </p>
          ${generateCodesSection()}
        </div>
        <p style="margin-top: 30px; text-align: center; color: #333;">
          🙏 Merci pour votre confiance et à très bientôt sur notre plateforme.
        </p>
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 Platform Web Test. Tous droits réservés.</p>
        </div>
      </div>
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Coupon received email sent:", info.response);
    return { success: true };
  } catch (err) {
    console.error("❌ Error sending coupon received email:", err);
    return { success: false, error: err.message };
  }
};

module.exports = { sendCouponReceivedEmail };
