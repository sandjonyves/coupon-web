const sequelize = require('../config/database');
const Coupon = require('./Coupon');
const User = require('./User');

// Synchronize all models
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established successfully.');
    
    await sequelize.sync(); // Set force: true to recreate tables
    console.log(' Database synchronized successfully.');
  } catch (error) {
    console.error(' Unable to connect to the database or sync models:', error);
  }
};

module.exports = {
  sequelize,
  Coupon,
  User,
  syncDatabase
}; 