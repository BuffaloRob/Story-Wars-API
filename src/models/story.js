// src/models/story.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Story = sequelize.define("Story", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    guessedAuthorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Story;
};
