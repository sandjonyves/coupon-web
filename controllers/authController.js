const { User } = require('../models');
const { generateToken } = require('../middleware/auth');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      password
    });

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Expo push token removed from system

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Récupérer l'utilisateur depuis le middleware d'authentification
    const userId = req.user.id;
    
    // Optionnel : Supprimer l'expoPushToken lors de la déconnexion
    // Cela empêche l'envoi de notifications à un appareil déconnecté
    const user = await User.findByPk(userId);
    if (user) {
      user.expoPushToken = null;
      await user.save();
      console.log(`User ${user.username} logged out, expoPushToken cleared`);
    }

    res.json({
      success: true,
      message: 'Logout successful',
      data: {
        userId: userId,
        logoutTime: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Expo push tokens removed

// Get current user profile
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // No profile fields to update for now

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all users (for admin page)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    const usersWithoutPasswords = users.map(u => u.toJSON());
    res.render('admin-users', { users: usersWithoutPasswords });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).render('error', { message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};

// Delete all users
const deleteAllUsers = async (req, res) => {
  try {
    await User.destroy({ where: {} });
    res.json({ success: true, message: 'Tous les utilisateurs ont été supprimés.' });
  } catch (error) {
    console.error('Erreur lors de la suppression des utilisateurs:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression des utilisateurs', error });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteAllUsers
}; 