const { sendCouponReceivedEmail, sendStatusNotificationEmail } = require('./services/emailService');

// Données de test pour un coupon
const testCouponData = {
  email: 'test@example.com',
  type: 'NEOSURF',
  montant: 50.00,
  devise: 'EURO',
  code1: 'ABC123DEF456',
  code1Valid: true,
  code2: 'XYZ789GHI012',
  code2Valid: false,
  code3: 'MNO345PQR678',
  code3Valid: true,
  code4: null,
  code4Valid: false,
  status: 'pending',
  createdAt: new Date()
};

async function testEmails() {
  console.log('🧪 Test des emails avec codes de coupon...\n');

  try {
    // Test 1: Email de réception de coupon
    console.log('📧 Test 1: Email de réception de coupon');
    const receivedResult = await sendCouponReceivedEmail(123, testCouponData);
    console.log('Résultat:', receivedResult);
    console.log('');

    // Test 2: Email de notification de statut (vérifié)
    console.log('📧 Test 2: Email de notification de statut (vérifié)');
    const verifiedResult = await sendStatusNotificationEmail(
      testCouponData.email, 
      123, 
      'verified', 
      testCouponData
    );
    console.log('Email de statut vérifié envoyé');
    console.log('');

    // Test 3: Email de notification de statut (invalide)
    console.log('📧 Test 3: Email de notification de statut (invalide)');
    const invalidResult = await sendStatusNotificationEmail(
      testCouponData.email, 
      123, 
      'invalid', 
      testCouponData
    );
    console.log('Email de statut invalide envoyé');
    console.log('');

    console.log('✅ Tous les tests d\'email ont été exécutés avec succès !');
    console.log('\n📝 Note: Si les emails ne sont pas configurés dans .env, les tests passeront sans erreur mais aucun email ne sera envoyé.');

  } catch (error) {
    console.error('❌ Erreur lors des tests dsjhsadsad:', error);
  }
}

// Exécuter les tests
testEmails(); 