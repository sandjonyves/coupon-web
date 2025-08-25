const { Sequelize } = require("sequelize");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false, // Passe à true pour debug SQL
  define: {
    timestamps: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // obligatoire sur Render
    },
  },
  pool: {
    max: 5,        // nb max connexions ouvertes
    min: 0,
    acquire: 30000, // délai max pour obtenir une connexion
    idle: 10000,    // durée avant de libérer une connexion idle
  },
});

module.exports = sequelize;
