const { Coupon } = require('./models');

async function checkDatabase() {
  try {
    console.log('🔍 Checking database content...');
    
    // Count all coupons
    const count = await Coupon.count();
    console.log(`📊 Total coupons in database: ${count}`);
    
    if (count > 0) {
      // Get all coupons
      const coupons = await Coupon.findAll({
        attributes: ['id', 'type', 'montant', 'devise', 'email', 'status', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });
      
      console.log('\n📋 Coupons found:');
      coupons.forEach((coupon, index) => {
        console.log(`${index + 1}. ID: ${coupon.id} | Type: ${coupon.type} | Montant: ${coupon.montant} ${coupon.devise} | Email: ${coupon.email} | Status: ${coupon.status} | Created: ${coupon.createdAt}`);
      });
    } else {
      console.log('📭 No coupons found in database');
    }
    
    // Check table structure
    console.log('\n🏗️ Checking table structure...');
    const tableInfo = await Coupon.sequelize.query("PRAGMA table_info(coupons);");
    console.log('Table structure:', tableInfo[0]);
    
  } catch (error) {
    console.error(' Error checking database:', error);
  } finally {
    process.exit(0);
  }
}

checkDatabase(); 