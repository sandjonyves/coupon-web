// config/database.js
const { Sequelize } = require('sequelize');

// L'URL complète fournie par Neon
const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Neon exige souvent ssl
    },
  },
  logging: false, // true si tu veux voir les requêtes SQL
});

module.exports = sequelize;
