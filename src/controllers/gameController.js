// src/controllers/gameController.js
const { Game, User, GamePlayer, Category, Story } = require("../models");
const { generateInviteCode } = require("../utils/helpers");

exports.createGame = async (req, res) => {
  try {
    const { name } = req.body;
    const leaderId = req.user.id;

    // Create game with unique invite code
    const game = await Game.create({
      name,
      leaderId,
      inviteCode: generateInviteCode(),
    });

    // Add leader as first game player
    await GamePlayer.create({
      userId: leaderId,
      gameId: game.id,
      status: "accepted",
    });

    res.status(201).json({
      success: true,
      game,
      inviteCode: game.inviteCode,
    });
  } catch (error) {
    console.error("Game creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating game",
    });
  }
};

exports.invitePlayer = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { username } = req.body;
    const leaderId = req.user.id;

    // Verify game exists and user is the leader
    const game = await Game.findOne({
      where: { id: gameId, leaderId },
    });

    if (!game) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to invite players to this game",
      });
    }

    // Find user to invite
    const userToInvite = await User.findOne({ where: { username } });
    if (!userToInvite) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create game player invitation
    await GamePlayer.create({
      userId: userToInvite.id,
      gameId: game.id,
      status: "invited",
    });

    res.status(200).json({
      success: true,
      message: `Invited ${username} to the game`,
    });
  } catch (error) {
    console.error("Player invitation error:", error);
    res.status(500).json({
      success: false,
      message: "Error inviting player",
    });
  }
};

exports.submitStory = async (req, res) => {
  try {
    const { gameId, categoryId, content } = req.body;
    const userId = req.user.id;

    // Find game player entry
    const gamePlayer = await GamePlayer.findOne({
      where: { userId, gameId, status: "accepted" },
    });

    if (!gamePlayer) {
      return res.status(403).json({
        success: false,
        message: "You are not a part of this game",
      });
    }

    // Check if player has already submitted 5 stories
    if (gamePlayer.storiesSubmitted >= 5) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted 5 stories",
      });
    }

    // Create story
    const story = await Story.create({
      userId,
      gameId,
      categoryId,
      content,
      isAnonymous: true,
    });

    // Update stories submitted count
    await gamePlayer.increment("storiesSubmitted");

    res.status(201).json({
      success: true,
      story,
    });
  } catch (error) {
    console.error("Story submission error:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting story",
    });
  }
};
