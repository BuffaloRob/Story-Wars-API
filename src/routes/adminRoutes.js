// routes/adminRoutes.js
import { Router } from "express";
const router = Router();
import { authenticateToken, isAdmin } from "../middleware/authMiddleware";
import { User } from "../models";

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(isAdmin);

// Get all users (admin only)
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role", "createdAt"], // Exclude password
    });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

// Promote user to admin (admin only)
router.put("/users/:userId/promote", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update role to admin
    user.role = "admin";
    await user.save();

    res.json({
      success: true,
      message: `User ${user.username} promoted to admin`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    res.status(500).json({
      success: false,
      message: "Error promoting user",
    });
  }
});

// Demote admin to regular user
router.put("/users/:userId/demote", async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-demotion
    if (parseInt(userId) === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Cannot demote yourself",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = "user";
    await user.save();

    res.json({
      success: true,
      message: `User ${user.username} demoted to regular user`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error demoting user:", error);
    res.status(500).json({
      success: false,
      message: "Error demoting user",
    });
  }
});

export default router;
