const nodemailer = require('nodemailer');
require('dotenv').config();
// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

/**
 * Envoyer un email de confirmation pour un coupon
 * @param {string} email - Adresse email du destinataire
 * @param {number} couponId - ID du coupon créé
 */
const sendConfirmationEmail = async (email, couponId) => {
  try {
    // Vérifier si l'email est configuré
    if (!transporter.options.auth.user || transporter.options.auth.user === 'your-email@gmail.com') {
      console.log('Email not configured, skipping email send');
      return;
    }

    const mailOptions = {
      from: transporter.options.auth.user,
      to: email,
      subject: 'Confirmation de vérification de coupon - Platform Web Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Platform Web Test</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Confirmation de vérification de coupon</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">✅ Demande Confirmée</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Votre demande de vérification de coupon a été enregistrée avec succès dans notre base de données.
            </p>
            
            <div style="background: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #333; font-weight: bold;">Numéro de référence: <span style="color: #007bff;">#${couponId}</span></p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Notre équipe va traiter votre demande dans les plus brefs délais. 
              Vous recevrez une notification dès que la vérification sera terminée.
            </p>
            
            <div style="background: #e8f5e8; border: 1px solid #28a745; border-radius: 10px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #155724; font-size: 14px;">
                <strong>💡 Conseil:</strong> Conservez ce numéro de référence pour tout suivi ultérieur.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Platform Web Test. Tous droits réservés.</p>
            <p>Cette plateforme est disponible 24h/24 et 7j/7</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
    // Ne pas faire échouer la requête si l'email échoue
  }
};

/**
 * Envoyer un email de confirmation de réception de coupon
 * @param {number} couponId - ID du coupon
 * @param {Object} couponData - Données du coupon (type, montant, devise, etc.)
 */
const sendCouponReceivedEmail = async (couponId, couponData) => {
  try {
    // Vérifier si l'email est configuré
    if (!transporter.options.auth.user || transporter.options.auth.user === 'your-email@gmail.com') {
      console.log('Email not configured, skipping coupon received email');
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: transporter.options.auth.user,
      to: couponData.email,
      subject: `Coupon reçu - Confirmation #${couponId} - Platform Web Test`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Platform Web Test</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Confirmation de réception de coupon</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">🎉 Coupon Reçu avec Succès !</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Nous avons bien reçu votre coupon et nous vous confirmons qu'il a été enregistré dans notre système.
            </p>
            
            <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 10px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0; margin-bottom: 15px;">📋 Détails du Coupon</h3>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div>
                  <strong style="color: #555;">Type:</strong>
                  <span style="color: #333; margin-left: 5px;">${couponData.type}</span>
                </div>
                <div>
                  <strong style="color: #555;">Montant:</strong>
                  <span style="color: #333; margin-left: 5px;">${couponData.montant} ${couponData.devise}</span>
                </div>
              </div>
              
              <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; color: #155724; font-weight: bold;">
                  Numéro de référence: <span style="color: #28a745;">#${couponId}</span>
                </p>
              </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 10px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⏱️ Prochaines étapes:</strong> Notre équipe va maintenant procéder à la vérification de votre coupon. 
                Vous recevrez une notification dès que le processus sera terminé.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Merci de votre confiance. Nous traitons votre demande avec le plus grand soin.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Platform Web Test. Tous droits réservés.</p>
            <p>Cette plateforme est disponible 24h/24 et 7j/7</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Coupon received email sent to:', couponData.email);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending coupon received email:', error);
    return { success: false, message: 'Failed to send email', error: error.message };
  }
};

/**
 * Envoyer un email de notification de statut
 * @param {string} email - Adresse email du destinataire
 * @param {number} couponId - ID du coupon
 * @param {string} status - Nouveau statut (verified/invalid)
 */
const sendStatusNotificationEmail = async (email, couponId, status) => {
  try {
    // Vérifier si l'email est configuré
    if (!transporter.options.auth.user || transporter.options.auth.user === 'your-email@gmail.com') {
      console.log('Email not configured, skipping status notification');
      return;
    }

    const statusText = status === 'verified' ? 'Vérifié' : 'Invalide';
    const statusColor = status === 'verified' ? '#28a745' : '#dc3545';
    const statusIcon = status === 'verified' ? '✅' : '❌';

    const mailOptions = {
      from: transporter.options.auth.user,
      to: email,
      subject: `Mise à jour de votre coupon #${couponId} - Platform Web Test`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Platform Web Test</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Mise à jour de votre demande</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 15px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">${statusIcon} Statut Mis à Jour</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Votre demande de vérification de coupon a été traitée.
            </p>
            
            <div style="background: #f8f9fa; border-left: 4px solid ${statusColor}; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; color: #333; font-weight: bold;">
                Coupon #${couponId}: <span style="color: ${statusColor};">${statusText}</span>
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              ${status === 'verified' 
                ? 'Votre coupon a été vérifié avec succès et est valide.' 
                : 'Votre coupon a été vérifié et s\'est avéré invalide.'
              }
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 Platform Web Test. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Status notification email sent to:', email);
  } catch (error) {
    console.error('Error sending status notification email:', error);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendCouponReceivedEmail,
  sendStatusNotificationEmail,
  transporter
}; 