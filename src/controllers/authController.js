import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { User } from "../models";

// User registration
export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user with default role='user'
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      // role will default to 'user'
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
}

// User login
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Find the user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token with user data including role
    const token = sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
}
