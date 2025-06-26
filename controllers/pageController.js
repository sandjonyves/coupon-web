// ==================== PAGE CONTROLLERS ====================

/**
 * Afficher la page d'accueil
 * GET /
 */
const getHomePage = (req, res) => {
  res.render('index', { 
    title: 'Platform Web Test - Vérification de Coupons',
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg')
  });
};

/**
 * Afficher la page de connexion
 * GET /login
 */
const getLoginPage = (req, res) => {
  res.render('login', { 
    title: 'Connexion - Platform Web Test'
  });
};

/**
 * Afficher la page d'enregistrement
 * GET /register
 */
const getRegisterPage = (req, res) => {
  res.render('register', { 
    title: 'Inscription - Platform Web Test'
  });
};

/**
 * Afficher la page de profil
 * GET /profile
 */
const getProfilePage = (req, res) => {
  res.render('profile', { 
    title: 'Profil - Platform Web Test'
  });
};

/**
 * Afficher la page d'administration des coupons
 * GET /admin-coupons
 */
const getAdminCouponsPage = (req, res) => {
  res.render('admin-coupons', { 
    title: 'Administration des Coupons - Platform Web Test'
  });
};

/**
 * Afficher la page d'erreur
 * GET /error
 */
const getErrorPage = (req, res) => {
  res.render('error', {
    title: 'Erreur - Platform Web Test',
    message: req.query.message || 'Une erreur est survenue',
    error: req.query.error ? { stack: req.query.error } : null
  });
};

/**
 * Route legacy pour la compatibilité
 * POST /verify-coupon
 */
const legacyVerifyCoupon = async (req, res) => {
  try {
    const { type, montant, devise, code, mail } = req.body;
    
    // Rediriger vers l'API
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        montant,
        devise,
        codes: code,
        email: mail
      })
    });

    const result = await response.json();
    
    if (result.success) {
      req.flash('success_msg', result.message);
    } else {
      req.flash('error_msg', result.message);
    }
    
    res.redirect('/');
  } catch (error) {
    console.error('Error in legacy route:', error);
    req.flash('error_msg', 'Une erreur est survenue.');
    res.redirect('/');
  }
};

module.exports = {
  getHomePage,
  getLoginPage,
  getRegisterPage,
  getProfilePage,
  getAdminCouponsPage,
  getErrorPage,
  legacyVerifyCoupon
}; 