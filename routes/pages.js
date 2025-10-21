const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// ==================== PAGE ROUTES ====================

/* GET / - Page d'accueil moderne */
router.get('/', pageController.getNewHomePage);

/* GET /verify - Page de vérification */
router.get('/verify', pageController.getVerifyPage);

/* GET /login - Page de connexion */
router.get('/login', pageController.getLoginPage);

/* GET /register - Page d'enregistrement */
router.get('/register', pageController.getRegisterPage);

/* GET /profile - Page de profil */
router.get('/profile', pageController.getProfilePage);

/* GET /admin-coupons - Page d'administration des coupons */
router.get('/admin-coupons', pageController.getAdminCouponsPage);

/* GET /error - Page d'erreur */
router.get('/error', pageController.getErrorPage);

/* POST /verify-coupon - Route legacy pour compatibilité */
router.post('/verify-coupon', pageController.legacyVerifyCoupon);

module.exports = router; 