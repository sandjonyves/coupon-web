// require('dotenv').config();
// const nodemailer = require('nodemailer');


// const transporter = nodemailer.createTransport({
//   host: 'mail.fokouemap.org',
//   port: 587,
//   secure: false, // use STARTTLS
//   auth: {
//     user: 'contact@plateform-test.cm',
//     pass: 'plateform@test@2004'
//   },
//   tls: {
//     rejectUnauthorized: false
//   },
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000
// });



// // Fonction pour envoyer l'email de coupon
// const sendCouponReceivedEmail = async (couponId, couponData) => {
// //   transporter.verify((error, success) => {
// //   if (error) {
// //     console.error('Email configuration error:', error);
   
// //   } else {
// //     console.log('✅ Email server is ready to send messages');

// //   }
// // })
//   try {
//     if (!couponData.email) {
//       return { success: false, message: "Aucune adresse email fournie" };
//     }

//     const generateCodesSection = () => {
//       const codes = [];
//       const codeInfos = ['code1', 'code2', 'code3', 'code4'];
//       codeInfos.forEach((key, i) => {
//         const value = couponData[key];
//         if (!value) return;
//         const valid = couponData[`${key}Valid`];
//         const status = valid ? ' Valide' : ' Invalide';
//         const color = valid ? '#28a745' : '#dc3545';
//         codes.push(`
//           <div style="display: flex; justify-content: space-between; align-items: center;
//                padding: 10px; border: 1px solid #dee2e6; border-radius: 5px; margin-bottom: 8px; background: #f8f9fa;">
//             <div><strong style="color: #555;">Code ${i + 1}:</strong></div>
//             <div><span style="color: ${color}; font-weight: bold;">${status}</span></div>
//           </div>
//         `);
//       });
//       return codes.join('');
//     };

//     const mailOptions = {
//       from: `"Platform Web Test" <${process.env.SMTP_USER}>`,
//       to: couponData.email,
//       subject: ` Confirmation de vérification de coupon`,
//       text: `Type de coupon: ${couponData.type}, Montant: ${couponData.montant} ${couponData.devise}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//             color: white; padding: 30px; border-radius: 15px; text-align: center;">
//             <h1 style="margin: 0; font-size: 24px;">Platform Web Test</h1>
//           </div>
//           <div style="background: white; padding: 30px; border-radius: 15px;
//             margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//             <p style="color: #666; line-height: 1.6;">
//               Type De Coupon: <strong>${couponData.type}</strong><br>
//               Montant du Coupon: <strong>${couponData.montant} ${couponData.devise}</strong>
//             </p>
//             ${generateCodesSection()}
//           </div>
//           <p style="margin-top: 30px; text-align: center; color: #333;">
//             🙏 Merci pour votre confiance et à très bientôt sur notre plateforme.
//           </p>
//           <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
//             <p>© ${new Date().getFullYear()} Platform Web Test. Tous droits réservés.</p>
//           </div>
//         </div>
//       `,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(" Email sent:", info.messageId);
//     return { success: true, message: "Email envoyé avec succès" };

//   } catch (error) {
//     console.error(" Error sending email:", error.message);
//     return { success: false, message: "Erreur lors de l'envoi de l'email" };
//   }
// };

// module.exports = { sendCouponReceivedEmail };



////sendgrid version


// require('dotenv').config();
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// // Fonction pour générer la section des codes
// const generateCodesSection = (couponData) => {
//   const codes = [];
//   const codeInfos = ['code1', 'code2', 'code3', 'code4'];
//   codeInfos.forEach((key, i) => {
//     const value = couponData[key];
//     if (!value) return;
//     const valid = couponData[`${key}Valid`];
//     const status = valid ? ' Valide' : ' Invalide';
//     const color = valid ? '#28a745' : '#dc3545';
//     codes.push(`
//       <div style="display: flex; justify-content: space-between; align-items: center;
//            padding: 10px; border: 1px solid #dee2e6; border-radius: 5px; margin-bottom: 8px; background: #f8f9fa;">
//         <div><strong style="color: #555;">Code ${i + 1}:</strong></div>
//         <div><span style="color: ${color}; font-weight: bold;">${status}</span></div>
//       </div>
//     `);
//   });
//   return codes.join('');
// };

// // Fonction pour envoyer l'email de coupon via API SendGrid
// const sendCouponReceivedEmail = async (couponId, couponData) => {
//   try {
//     if (!couponData.email) {
//       return { success: false, message: "Aucune adresse email fournie" };
//     }

//     const htmlContent = `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
//         <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white; padding: 30px; border-radius: 15px; text-align: center;">
//           <h1 style="margin: 0; font-size: 24px;">Platform Web Test</h1>
//         </div>
//         <div style="background: white; padding: 30px; border-radius: 15px;
//           margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//           <p style="color: #666; line-height: 1.6;">
//             Type De Coupon: <strong>${couponData.type}</strong><br>
//             Montant du Coupon: <strong>${couponData.montant} ${couponData.devise}</strong>
//           </p>
//           ${generateCodesSection(couponData)}
//         </div>
//         <p style="margin-top: 30px; text-align: center; color: #333;">
//           🙏 Merci pour votre confiance et à très bientôt sur notre plateforme.
//         </p>
//         <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
//           <p>© ${new Date().getFullYear()} Platform Web Test. Tous droits réservés.</p>
//         </div>
//       </div>
//     `;

//     const msg = {
//       to: couponData.email,
//       from: process.env.SMTP_USER, // email validé sur SendGrid
//       subject: `Confirmation de vérification de coupon`,
//       text: `Type de coupon: ${couponData.type}, Montant: ${couponData.montant} ${couponData.devise}`,
//       html: htmlContent,
//     };

//     await sgMail.send(msg);
//     console.log("✅ Email envoyé avec succès via SendGrid API !");
//     return { success: true, message: "Email envoyé avec succès" };

//   } catch (error) {
//     console.error(" Erreur lors de l'envoi de l'email via SendGrid API:", error.message);
//     return { success: false, message: "Erreur lors de l'envoi de l'email via API" };
//   }
// };

// module.exports = { sendCouponReceivedEmail };






/// mailersend version


// const dotenv = require("dotenv");
// const {
//   MailerSend,
//   EmailParams,
//   Sender,
//   Recipient
// } = require("mailersend");

// dotenv.config();

// const mailerSend = new MailerSend({
//   apiKey: process.env.MAILERSEND_API_KEY,
// });

// // Fonction pour générer la section des codes
// const generateCodesSection = (couponData) => {
//   const codes = [];
//   const codeInfos = ["code1", "code2", "code3", "code4"];

//   codeInfos.forEach((key, i) => {
//     const value = couponData[key];
//     if (!value) return;

//     const valid = couponData[`${key}Valid`];
//     const status = valid ? "Valide" : "Invalide";
//     const color = valid ? "#28a745" : "#dc3545";

//     codes.push(`
//       <div style="display:flex; justify-content:space-between; align-items:center;
//            padding:10px; border:1px solid #dee2e6; border-radius:5px;
//            margin-bottom:8px; background:#f8f9fa;">
//         <div><strong style="color:#555;">Code ${i + 1} :</strong></div>
//         <div><span style="color:${color}; font-weight:bold;">${status}</span></div>
//       </div>
//     `);
//   });

//   return codes.join("");
// };

// // ✅ FONCTION (sans export ES Module)
// const sendCouponReceivedEmail = async (couponId, couponData) => {
//   try {
//     if (!couponData.email) {
//       return { success: false, message: "Aucune adresse email fournie" };
//     }

//     const htmlContent = `
//       <div style="font-family:Arial,sans-serif; max-width:600px; margin:auto; padding:20px;">
//         <div style="background:linear-gradient(135deg,#667eea,#764ba2);
//           color:white; padding:30px; border-radius:15px; text-align:center;">
//           <h1 style="margin:0; font-size:24px;">Platform Web Test</h1>
//         </div>

//         <div style="background:white; padding:30px; border-radius:15px;
//           margin-top:20px; box-shadow:0 4px 6px rgba(0,0,0,.1);">
//           <p style="color:#666; line-height:1.6;">
//             Type de coupon : <strong>${couponData.type}</strong><br>
//             Montant du coupon : <strong>${couponData.montant} ${couponData.devise}</strong>
//           </p>
//           ${generateCodesSection(couponData)}
//         </div>

//         <p style="margin-top:30px; text-align:center; color:#333;">
//           🙏 Merci pour votre confiance et à très bientôt sur notre plateforme.
//         </p>

//         <div style="text-align:center; margin-top:20px; color:#999; font-size:12px;">
//           © ${new Date().getFullYear()} Platform Web Test. Tous droits réservés.
//         </div>
//       </div>
//     `;

//     const emailParams = new EmailParams()
//       .setFrom(
//         new Sender(
//           process.env.MAIL_FROM_EMAIL,
//           process.env.MAIL_FROM_NAME
//         )
//       )
//       .setTo([new Recipient(couponData.email)])
//       .setSubject("Confirmation de vérification de coupon")
//       .setText(
//         `Type: ${couponData.type}, Montant: ${couponData.montant} ${couponData.devise}`
//       )
//       .setHtml(htmlContent);

//     await mailerSend.email.send(emailParams);

//     console.log("✅ Email envoyé avec succès via MailerSend");
//     return { success: true, message: "Email envoyé avec succès" };

//   } catch (error) {
//     console.error(" Erreur MailerSend :", error);
//     return { success: false, message: "Erreur lors de l'envoi de l'email" };
//   }
// };

// // ✅ EXPORT COMMONJS
// module.exports = {
//   sendCouponReceivedEmail,
// };


require("dotenv").config();
const nodemailer = require("nodemailer");

/* =======================
   CONFIG SMTP NUCLE-X
======================= */
const transporter = nodemailer.createTransport({
  host: "mail.nucle-x.work",
  port: 465,               // SSL
  secure: true,            // obligatoire pour 465
  auth: {
    user: "noreply",       // LOGIN
    pass: "Noreply@123",   // PASSWORD
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* =======================
   TEST SMTP (OPTIONNEL)
======================= */
transporter.verify((error, success) => {
  if (error) {
    console.error(" Erreur SMTP :", error);
  } else {
    console.log(" Serveur SMTP prêt à envoyer des emails");
  }
});

/* =======================
   GENERATION DES CODES
======================= */
const generateCodesSection = (couponData) => {
  const codes = [];
  const codeInfos = ["code1", "code2", "code3", "code4"];

  codeInfos.forEach((key, i) => {
    const value = couponData[key];
    if (!value) return;

    const valid = couponData[`${key}Valid`];
    const status = valid ? "Valide" : "Invalide";
    const color = valid ? "#28a745" : "#dc3545";

    codes.push(`
      <div style="display:flex;justify-content:space-between;align-items:center;
           padding:10px;border:1px solid #dee2e6;border-radius:5px;
           margin-bottom:8px;background:#f8f9fa;">
        <strong style="color:#555;">Code ${i + 1} :</strong>
        <span style="color:${color};font-weight:bold;">${status}</span>
      </div>
    `);
  });

  return codes.join("");
};

/* =======================
   ENVOI EMAIL COUPON
======================= */
const sendCouponReceivedEmail = async (couponId, couponData) => {
  try {
    if (!couponData.email) {
      return { success: false, message: "Aucune adresse email fournie" };
    }

    const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);
          color:white;padding:30px;border-radius:15px;text-align:center;">
          <h1 style="margin:0;font-size:24px;">Platform Web Test</h1>
        </div>

        <div style="background:white;padding:30px;border-radius:15px;
          margin-top:20px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          
          <p style="color:#666;line-height:1.6;">
            Type de coupon : <strong>${couponData.type}</strong><br>
            Montant : <strong>${couponData.montant} ${couponData.devise}</strong>
          </p>

          ${generateCodesSection(couponData)}
        </div>

        <p style="margin-top:30px;text-align:center;color:#333;">
          🙏 Merci pour votre confiance.
        </p>

        <div style="text-align:center;margin-top:20px;color:#999;font-size:12px;">
          © ${new Date().getFullYear()} Platform Web Test
        </div>

      </div>
    `;

    await transporter.sendMail({
      from: `"Platform Web Test" <noreply@plateform-test.cm>`,
      to: couponData.email,
      subject: "Confirmation de vérification de coupon",
      text: `Type: ${couponData.type} - Montant: ${couponData.montant} ${couponData.devise}`,
      html: htmlContent,
    });

    console.log("✅ Email envoyé avec succès");
    return { success: true, message: "Email envoyé avec succès" };

  } catch (error) {
    console.error(" Erreur lors de l'envoi :", error);
    return { success: false, message: "Erreur lors de l'envoi de l'email" };
  }
};

module.exports = { sendCouponReceivedEmail };