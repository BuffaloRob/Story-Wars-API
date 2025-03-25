import { Sequelize } from "sequelize";
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

// Import / Initialize models
const User = require("./user")(sequelize);
const Game = require("./game")(sequelize);
const Category = require("./category")(sequelize);
const Story = require("./story")(sequelize);
const GamePlayer = require("./gamePlayer")(sequelize);

// Define associations
User.hasMany(Game, { foreignKey: "leaderId", as: "LeaderedGames" });
Game.belongsTo(User, { foreignKey: "leaderId", as: "Leader" });

// Many-to-Many relationship between Users and Games
User.belongsToMany(Game, {
  through: GamePlayer,
  foreignKey: "userId",
  otherKey: "gameId",
});
Game.belongsToMany(User, {
  through: GamePlayer,
  foreignKey: "gameId",
  otherKey: "userId",
});

// Relationship with Stories
User.hasMany(Story, { foreignKey: "userId" });
Story.belongsTo(User, { foreignKey: "userId" });

Game.hasMany(Story, { foreignKey: "gameId" });
Story.belongsTo(Game, { foreignKey: "gameId" });

Category.hasMany(Story, { foreignKey: "categoryId" });
Story.belongsTo(Category, { foreignKey: "categoryId" });

// Sync all models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

export default {
  sequelize,
  User,
  Game,
  Category,
  Story,
  GamePlayer,
  syncDatabase,
};