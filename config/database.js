const { Sequelize } = require("sequelize");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || "development";

console.log(`🔧 Database config - NODE_ENV: ${NODE_ENV}`);
console.log(`🔧 Database config - DATABASE_URL exists: ${!!DATABASE_URL}`);

let sequelize;

if (DATABASE_URL) {
  console.log("📊 Using PostgreSQL database");
  // Use Postgres when DATABASE_URL is provided
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: NODE_ENV === 'development' ? console.log : false,
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
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 3
    }
  });
} else {
  console.log("📊 Using SQLite database (fallback)");
  // Fallback to SQLite in development if no DATABASE_URL
  console.warn("⚠️ DATABASE_URL not set. Falling back to local SQLite database (database.sqlite).");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
    },
  });
}

module.exports = sequelize;
