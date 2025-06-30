const { User } = require('../models');
const { generateToken } = require('../middleware/auth');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, password, expoPushToken } = req.body;

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
      password,
      expoPushToken: expoPushToken || null
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
    const { username, password, expoPushToken } = req.body;
    
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

    // Mettre à jour l'expoPushToken si fourni
    if (expoPushToken) {
      user.expoPushToken = expoPushToken;
      await user.save();
    }

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

// Get all Expo Push Tokens (API endpoint)
const getAllExpoTokens = async (req, res) => {
  try {
    const deviceTokens = await getAllExpoTokensData();
    res.json({ success: true, deviceTokens });
  } catch (error) {
    console.error('Error in getAllExpoTokens:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des tokens', 
      error: error.message 
    });
  }
};

// Get all Expo Push Tokens (utility function - no req/res)
const getAllExpoTokensData = async () => {
  try {
    const users = await User.findAll({
      attributes: ['expoPushToken'],
      where: {
        expoPushToken: {
          [require('sequelize').Op.not]: null
        }
      }
    });
    
    console.log('Users with expoPushToken:', users);
    const deviceTokens = users.map(u => u.expoPushToken).filter(token => token !== null);
    console.log('Device tokens:', deviceTokens);
    
    return deviceTokens;
  } catch (error) {
    console.error('Error in getAllExpoTokensData:', error);
    return [];
  }
};

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

// Update user profile (including expoPushToken)
const updateProfile = async (req, res) => {
  try {
    const { expoPushToken } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update expoPushToken if provided
    if (expoPushToken !== undefined) {
      user.expoPushToken = expoPushToken;
      await user.save();
    }

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

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getAllExpoTokens,
  getAllExpoTokensData
}; 