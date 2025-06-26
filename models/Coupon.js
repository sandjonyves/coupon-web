const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('NEOSURF', 'PCS', 'TRANSCASH', 'PAYSAFECARD', 'GOOGLE PLAY', 'STEAM', 'FLEXEPIN', 'CASHLIB', 'NETFLIX', 'AMAZON'),
    allowNull: false
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  devise: {
    type: DataTypes.ENUM('EURO', 'Dollar', 'Dollard'),
    allowNull: false
  },
  code1: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  code2: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  code3: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  code4: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'invalid'),
    defaultValue: 'pending'
  },
  encryptedData: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  verificationDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'coupons',
  timestamps: true
});

module.exports = Coupon; 