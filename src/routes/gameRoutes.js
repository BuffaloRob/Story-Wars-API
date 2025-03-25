// src/routes/gameRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const gameController = require("../controllers/gameController");

// Create a new game (requires authentication)
router.post("/", authenticateToken, gameController.createGame);

// Invite a player to a game (leader only)
router.post("/:gameId/invite", authenticateToken, gameController.invitePlayer);

// Submit a story for a game
router.post("/:gameId/stories", authenticateToken, gameController.submitStory);

module.exports = router;
