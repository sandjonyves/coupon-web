const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authRoutes = require('./auth');

// ==================== AUTH ROUTES ====================
router.use('/auth', authRoutes);

// ==================== API ROUTES ====================

/* GET /api/coupons - Récupérer tous les coupons */
router.get('/coupons', couponController.getAllCoupons);

/* POST /api/coupons - Créer un nouveau coupon */
router.post('/coupons', couponController.createCoupon);

/* POST /api/coupons/:id/send-received-email - Envoyer email de confirmation de réception */
router.post('/coupons/:id/send-received-email', couponController.sendReceivedEmail);

/* GET /api/coupons/:id - Récupérer un coupon par ID */
router.get('/coupons/:id', couponController.getCouponById);

/* PUT /api/coupons/:id - Mettre à jour un coupon */
router.put('/coupons/:id', couponController.updateCoupon);

/* DELETE /api/coupons/:id - Supprimer un coupon */
router.delete('/coupons/:id', couponController.deleteCoupon);

/* POST /api/encrypt - Crypter des données */
router.post('/encrypt', couponController.encryptData);

module.exports = router; 