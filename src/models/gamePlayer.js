// src/models/gamePlayer.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const GamePlayer = sequelize.define("GamePlayer", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("invited", "accepted", "declined"),
      defaultValue: "invited",
    },
    storiesSubmitted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return GamePlayer;
};
