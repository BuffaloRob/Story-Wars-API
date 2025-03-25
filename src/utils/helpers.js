// src/utils/helpers.js
const crypto = require("crypto");

// Generate a unique invite code
exports.generateInviteCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

// Seed initial categories
exports.seedCategories = async () => {
  const { Category } = require("../models");
  const categories = [
    "Fantasy Adventure",
    "Sci-Fi Exploration",
    "Historical Mystery",
    "Romantic Comedy",
    "Supernatural Thriller",
    "Dystopian Future",
    "Urban Legend",
    "Time Travel Paradox",
    "Space Opera",
    "Magical Realism",
  ];

  for (const categoryName of categories) {
    await Category.findOrCreate({
      where: { name: categoryName },
    });
  }
};
