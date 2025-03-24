// models/index.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// Database connection configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql", // mysql, postgres, sqlite, etc.
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Initialize models
const User = require("./user").default(sequelize);

// Define relationships if needed
// For example, if you later add a UserProfile model:
// User.hasOne(UserProfile);
// UserProfile.belongsTo(User);

// Sync all models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

module.exports = {
  sequelize,
  User,
  syncDatabase,
};
