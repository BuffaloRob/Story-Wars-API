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
    "Halloween",
    "Death",
    "Romance",
    "Holidays",
    "Family",
  ];

  for (const categoryName of categories) {
    await Category.findOrCreate({
      where: { name: categoryName },
    });
  }
};
