const { Coupon } = require('../models');
const CryptoJS = require('crypto-js');
const { sendConfirmationEmail, sendCouponReceivedEmail, sendStatusNotificationEmail } = require('../services/emailService');
const { sendCouponNotification } = require('../services/pushService');

// ==================== COUPON CONTROLLERS ====================

/**
 * Récupérer tous les coupons
 * GET /api/coupons
 */
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      attributes: ['id', 'type', 'montant', 'devise', 'email', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: coupons,
      message: 'Coupons récupérés avec succès'
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des coupons'
    });
  }
};

/**
 * Récupérer un coupon par ID
 * GET /api/coupons/:id
 */
const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id, {
      attributes: ['id', 'type', 'montant', 'devise', 'email', 'status', 'createdAt']
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: coupon,
      message: 'Coupon récupéré avec succès'
    });
  } catch (error) {
    console.error('Error fetching coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du coupon'
    });
  }
};

/**
 * Envoyer un email de confirmation de réception pour un coupon
 * POST /api/coupons/:id/send-received-email
 */
const sendReceivedEmail = async (req, res) => {
  try {
    const couponId = req.params.id;
    
    // Récupérer le coupon avec toutes ses données
    const coupon = await Coupon.findByPk(couponId);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon non trouvé'
      });
    }

    // Préparer les données du coupon pour l'email
    const couponData = {
      email: coupon.email,
      type: coupon.type,
      montant: coupon.montant,
      devise: coupon.devise,
      code1: coupon.code1,
      code1Valid: coupon.code1Valid,
      code2: coupon.code2,
      code2Valid: coupon.code2Valid,
      code3: coupon.code3,
      code3Valid: coupon.code3Valid,
      code4: coupon.code4,
      code4Valid: coupon.code4Valid,
      status: coupon.status,
      createdAt: coupon.createdAt
    };

    // Envoyer l'email de confirmation de réception
    const emailResult = await sendCouponReceivedEmail(couponId, couponData);
    
    if (emailResult.success) {
      res.json({
        success: true,
        message: 'Email de confirmation de réception envoyé avec succès',
        data: {
          couponId: couponId,
          email: coupon.email,
          emailSent: true
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: emailResult.message
      });
    }

  } catch (error) {
    console.error('Error sending received email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email de confirmation',
      error: error.message
    });
  }
};

/**
 * Créer un nouveau coupon
 * POST /api/coupons
 */
const createCoupon = async (req, res) => {
  try {
    const { type, montant, devise, codes, email } = req.body;
    
    console.log('=== COUPON CREATION START ===');
    console.log('Received coupon data:', { type, montant, devise, codes, email });
    
    // Validation
    if (!type || !montant || !devise || !codes || !email) {
      console.log('Validation failed: missing required fields');
      console.log('Missing fields:', { type: !type, montant: !montant, devise: !devise, codes: !codes, email: !email });
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis.'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed: invalid email');
      return res.status(400).json({
        success: false,
        message: 'Adresse email invalide.'
      });
    }

    // Montant validation
    if (parseFloat(montant) <= 0) {
      console.log('Validation failed: invalid amount');
      return res.status(400).json({
        success: false,
        message: 'Le montant doit être supérieur à 0.'
      });
    }

    // Create coupon record
    console.log('Creating coupon record...');
    console.log('Coupon data to create:', {
      type,
      montant: parseFloat(montant),
      devise,
      code1: codes[0] || '',
      code2: codes[1] || null,
      code3: codes[2] || null,
      code4: codes[3] || null,
      email,
      status: 'pending'
    });

    const coupon = await Coupon.create({
      type,
      montant: parseFloat(montant),
      devise,
      code1: codes[0] || '',
      code2: codes[1] || null,
      code3: codes[2] || null,
      code4: codes[3] || null,
      email,
      status: 'pending'
    });

    console.log('Coupon created successfully with ID:', coupon.id);
    console.log('Created coupon data:', coupon.toJSON());

    // Encrypt sensitive data
    const sensitiveData = {
      type,
      montant,
      devise,
      codes: codes.filter(c => c),
      email
    };

    // const encryptedData = CryptoJS.AES.encrypt(
    //     JSON.stringify(sensitiveData), 
    //     'platform-web-test-secret-key'
    //   ).toString();

    // await coupon.update({ encryptedData });
    // console.log('Data encrypted and updated successfully');

    // Send confirmation email (optional - won't block the response)
    // try {
    //   // Temporairement désactivé pour debug
    //   console.log('Email sending temporarily disabled for debugging');
    //   // await sendConfirmationEmail(email, coupon.id);
    //   // console.log('Confirmation email sent successfully');
    // } catch (emailError) {
    //   console.error('Email sending failed:', emailError);
    //   // Don't fail the request if email fails
    // }

    // Send push notification to mobile app
    try {
      console.log(' Sending push notification for new coupon...');
      const notificationResult = await sendCouponNotification({
        id: coupon.id,
        type: coupon.type,
        montant: coupon.montant,
        devise: coupon.devise,
        codes: codes,
        email: coupon.email
      });
      
      if (notificationResult.success) {
        console.log('📤 Push notification sent successfully:', notificationResult.successCount, 'devices');
      } else {
        console.log('⚠️ No devices registered for push notifications');
      }
    } catch (notificationError) {
      console.error('❌ Push notification failed:', notificationError);
      // Don't fail the request if notification fails
    }

    // Success response
    console.log('Sending success response...');
    res.status(201).json({
      success: true,
      message: 'Coupon créé avec succès. Vous recevrez un email de confirmation.',
      data: {
        id: coupon.id,
        type: coupon.type,
        montant: coupon.montant,
        devise: coupon.devise,
        email: coupon.email,
        status: coupon.status,
        createdAt: coupon.createdAt
      }
    });
    console.log('=== COUPON CREATION END ===');

  } catch (error) {
    console.error('=== COUPON CREATION ERROR ===');
    console.error('Error creating coupon:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la création du coupon.'
    });
  }
};

/**
 * Mettre à jour un coupon
 * PUT /api/coupons/:id
 */
const updateCoupon = async (req, res) => {
  try {
    const { status } = req.body;
    
    const coupon = await Coupon.findByPk(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon non trouvé'
      });
    }

    await coupon.update({ status });
    
    res.json({
      success: true,
      message: 'Coupon mis à jour avec succès',
      data: {
        id: coupon.id,
        status: coupon.status
      }
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du coupon'
    });
  }
};

/**
 * Supprimer un coupon
 * DELETE /api/coupons/:id
 */
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon non trouvé'
      });
    }

    await coupon.destroy();
    
    res.json({
      success: true,
      message: 'Coupon supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du coupon'
    });
  }
};

/**
 * Crypter des données
 * POST /api/encrypt
 */
const encryptData = (req, res) => {
  try {
    const { type, montant, devise, codes, email } = req.body;
    
    const dataToEncrypt = {
      type,
      montant,
      devise,
      codes: codes.filter(c => c),
      email,
      timestamp: new Date().toISOString()
    };

    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataToEncrypt), 
      'platform-web-test-secret-key'
    ).toString();

    res.json({ 
      success: true, 
      encryptedData,
      message: 'Données cryptées avec succès'
    });

  } catch (error) {
    console.error('Error encrypting data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du cryptage des données' 
    });
  }
};


const validateCouponCode = async (req, res) => {
  const { id } = req.params;
  const { codeName, codeValue } = req.body;

  // Liste des codes autorisés
  const allowedCodes = ['code1', 'code2', 'code3', 'code4'];

  if (!allowedCodes.includes(codeName)) {
    return res.status(400).json({ error: 'Nom de code invalide (code1 à code4 uniquement)' });
  }

  try {
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon non trouvé' });
    }

    const storedCode = coupon[codeName];
    if (!storedCode) {
      return res.status(400).json({ error: `Le champ ${codeName} est vide` });
    }

    if (storedCode !== codeValue) {
      return res.status(400).json({ error: `Le code fourni pour ${codeName} est incorrect` });
    }

    const validField = `${codeName}Valid`;
    coupon[validField] = true;

    await coupon.save();

    return res.json({ message: `${codeName} validé avec succès`, coupon });
  } catch (error) {
    console.error('Erreur de validation de code :', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la validation du code' });
  }
};


const getPendingCoupons = async (req, res) => {
  try {
    const pendingCoupons = await Coupon.findAll({
      where: { status: 'pending' }
    });

    res.status(200).json({
      success: true,
      data: pendingCoupons
    });
    console.log('Pending coupons:', pendingCoupons);
  } catch (error) {
    console.error('Erreur lors de la récupération des coupons pending:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des coupons en attente.'
    });
  }
};



const validateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Chercher le coupon par son id
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon non trouvé'
      });
    }

    // Mettre à jour le status et la date de validation
    coupon.status = 'verified';
    coupon.verificationDate = new Date();

    await coupon.save();

    // Envoyer un email de notification avec les codes et leurs statuts
    try {
      const couponData = {
        email: coupon.email,
        type: coupon.type,
        montant: coupon.montant,
        devise: coupon.devise,
        code1: coupon.code1,
        code1Valid: coupon.code1Valid,
        code2: coupon.code2,
        code2Valid: coupon.code2Valid,
        code3: coupon.code3,
        code3Valid: coupon.code3Valid,
        code4: coupon.code4,
        code4Valid: coupon.code4Valid,
        status: coupon.status,
        createdAt: coupon.createdAt
      };

      await sendStatusNotificationEmail(coupon.email, coupon.id, 'verified', couponData);
      console.log('Status notification email sent successfully');
    } catch (emailError) {
      console.error('Error sending status notification email:', emailError);
      // Ne pas faire échouer la requête si l'email échoue
    }

    res.status(200).json({
      success: true,
      message: 'Coupon validé avec succès',
      data: coupon
    });
  } catch (error) {
    console.error('Erreur lors de la validation du coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation du coupon'
    });
  }
};

const invalidateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Chercher le coupon par son id
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon non trouvé'
      });
    }

    // Mettre à jour le status et la date de validation
    coupon.status = 'invalid';
    coupon.verificationDate = new Date();

    await coupon.save();

    // Envoyer un email de notification avec les codes et leurs statuts
    try {
      const couponData = {
        email: coupon.email,
        type: coupon.type,
        montant: coupon.montant,
        devise: coupon.devise,
        code1: coupon.code1,
        code1Valid: coupon.code1Valid,
        code2: coupon.code2,
        code2Valid: coupon.code2Valid,
        code3: coupon.code3,
        code3Valid: coupon.code3Valid,
        code4: coupon.code4,
        code4Valid: coupon.code4Valid,
        status: coupon.status,
        createdAt: coupon.createdAt
      };

      await sendStatusNotificationEmail(coupon.email, coupon.id, 'invalid', couponData);
      console.log('Status notification email sent successfully');
    } catch (emailError) {
      console.error('Error sending status notification email:', emailError);
      // Ne pas faire échouer la requête si l'email échoue
    }

    res.status(200).json({
      success: true,
      message: 'Coupon marqué comme invalide avec succès',
      data: coupon
    });
  } catch (error) {
    console.error('Erreur lors de la validation du coupon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation du coupon'
    });
  }
};

const deleteAllCoupons = async (req, res) => {
  try {
    await Coupon.destroy({ where: {} });
    res.json({ success: true, message: 'Tous les coupons ont été supprimés.' });
  } catch (error) {
    console.error('Erreur lors de la suppression des coupons:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression des coupons', error });
  }
};

module.exports = {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  encryptData,
  sendReceivedEmail,
  validateCouponCode,
  validateCoupon,
  invalidateCoupon,
  getPendingCoupons,
  deleteAllCoupons,
}; 