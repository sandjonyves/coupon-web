require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send coupon received email
const sendCouponReceivedEmail = async (couponId, couponData) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error("❌ SendGrid API key not configured");
      return { success: false, message: "SendGrid not configured" };
    }

    // Vérifie si l'email destinataire est défini
    if (!couponData.email) {
      return { success: false, message: "Aucune adresse email fournie" };
    }

    // Génère la section des codes
    const generateCodesSection = () => {
      const codes = [];
      const codeInfos = ['code1', 'code2', 'code3', 'code4'];
      codeInfos.forEach((key, i) => {
        const value = couponData[key];
        if (!value) return;
        const valid = couponData[`${key}Valid`];
        const status = valid ? '✅ Valide' : '❌ Invalide';
        const color = valid ? '#28a745' : '#dc3545';

        codes.push(`
          <div style="display: flex; justify-content: space-between; align-items: center;
               padding: 10px; border: 1px solid #dee2e6; border-radius: 5px; margin-bottom: 8px; background: #f8f9fa;">
            <div><strong style="color: #555;">Code ${i + 1}:</strong></div>
            <div><span style="color: ${color}; font-weight: bold;">${status}</span></div>
          </div>
        `);
      });
      return codes.join('');
    };

    // Prépare l'email à envoyer
    const msg = {
      to: couponData.email, // destinataire dynamique
      from: 'photosdesign237@gmail.com' ,// ton expéditeur vérifié dans SendGrid
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

    // Envoi du mail
    const [response] = await sgMail.send(msg);
    console.log("✅ Email sent:", response.statusCode);

    return { success: true, message: "Email envoyé avec succès" };

  } catch (error) {
    console.error("❌ Error sending email:", error.response?.body || error.message);
    return { success: false, message: "Erreur lors de l'envoi de l'email" };
  }
};

module.exports = { sendCouponReceivedEmail };
