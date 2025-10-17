const { Sequelize } = require("sequelize");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || "development";

let sequelize;

if (DATABASE_URL) {
  // Use Postgres when DATABASE_URL is provided
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    define: {
      timestamps: true,
    },
    dialectOptions: NODE_ENV === "production" ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Fallback to SQLite in development if no DATABASE_URL
  console.warn("⚠️ DATABASE_URL not set. Falling back to local SQLite database (database.sqlite).");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
    define: {
      timestamps: true,
    },
  });
}

module.exports = sequelize;
