// src/models/game.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Game = sequelize.define("Game", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("preparing", "in_progress", "completed"),
      defaultValue: "preparing",
    },
    inviteCode: {
      type: DataTypes.STRING,
      unique: true,
    },
    leaderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Game;
};
