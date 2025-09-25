const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const authRoutes = require('./auth');
const { deleteAllCoupons } = require('../controllers/couponController');
const { deleteAllUsers } = require('../controllers/authController');
const { dropDatabase } = require('../controllers/pageController');

// ==================== AUTH ROUTES ====================
router.use('/auth', authRoutes);

// ==================== API ROUTES ====================

// Routes pour les coupons
router.get('/coupons', couponController.getAllCoupons);
router.get('/coupons/pending', couponController.getPendingCoupons);
router.get('/coupons/:id', couponController.getCouponById);

router.post('/coupons', couponController.createCoupon);
router.post('/coupons/:id/send-received-email', couponController.sendReceivedEmail);

// Validation d'un code de coupon (si tu veux garder POST, sinon PUT)
router.post('/coupons/code/validate/:id', couponController.validateCouponCode);

// Validation du coupon (mise à jour du status à "verified")
router.put('/coupons/validate/:id', couponController.validateCoupon);

// Invalidation du coupon (mise à jour du status à "invalid")
router.put('/coupons/invalidate/:id', couponController.invalidateCoupon);
// Supprimer tous les coupons
router.delete('/coupons/all', deleteAllCoupons);
router.put('/coupons/:id', couponController.updateCoupon);
router.delete('/coupons/:id', couponController.deleteCoupon);

// Route pour crypter des données (hors coupon)
router.post('/encrypt', couponController.encryptData);


// Supprimer tous les utilisateurs
router.delete('/users', deleteAllUsers);
// Supprimer toute la base de données
router.delete('/database', dropDatabase);

module.exports = router;
