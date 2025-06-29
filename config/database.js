const { Sequelize } = require('sequelize');
require('dotenv').config();
// Utilise une variable d'environnement pour sécuriser ton URL
const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Met à true pour voir les requêtes SQL dans la console
  define: {
    timestamps: true
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Important pour Render
    }
  }
});

module.exports = sequelize;
