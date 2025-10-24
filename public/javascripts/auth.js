// Authentication utilities for client-side
class AuthManager {
  constructor() {
    this.baseURL = '/api/auth';
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get auth token
  getToken() {
    return this.token;
  }

  // Register new user
  async register(username, password, expoPushToken = null) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, expoPushToken })
      });

      const data = await response.json();
      
      if (data.success) {
        this.token = data.data.token;
        this.user = data.data.user;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Erreur de connexion. Veuillez réessayer.'
      };
    }
  }

  // Login user
  async login(username, password, expoPushToken = null) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, expoPushToken })
      });

      const data = await response.json();
      
      if (data.success) {
        this.token = data.data.token;
        this.user = data.data.user;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Erreur de connexion. Veuillez réessayer.'
      };
    }
  }

  // Logout user
  async logout() {
    try {
      // Appeler l'API de déconnexion si l'utilisateur est connecté
      if (this.token) {
        const response = await fetch(`${this.baseURL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        console.log('Logout API response:', data);
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continuer même si l'API échoue
    }

    // Nettoyer les données locales
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Rediriger vers la page de connexion
    window.location.href = '/login';
  }

  // Get user profile
  async getProfile() {
    if (!this.token) {
      return { success: false, message: 'Non authentifié' };
    }

    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      
      if (data.success) {
        this.user = data.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Erreur lors de la récupération du profil'
      };
    }
  }

  // Update user profile
  async updateProfile(expoPushToken) {
    if (!this.token) {
      return { success: false, message: 'Non authentifié' };
    }

    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expoPushToken })
      });

      const data = await response.json();
      
      if (data.success) {
        this.user = data.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Erreur lors de la mise à jour du profil'
      };
    }
  }

  // Make authenticated API requests
  async authenticatedRequest(url, options = {}) {
    if (!this.token) {
      throw new Error('Non authentifié');
    }

    const defaultOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      }
    };

    const finalOptions = { ...defaultOptions, ...options };
    
    if (finalOptions.body && typeof finalOptions.body === 'object') {
      finalOptions.body = JSON.stringify(finalOptions.body);
    }

    const response = await fetch(url, finalOptions);
    
    // If token is expired, logout
    if (response.status === 401) {
      this.logout();
      throw new Error('Token expiré');
    }

    return response;
  }
}

// Create global instance
window.authManager = new AuthManager();

// Auto-redirect if not authenticated on protected pages
document.addEventListener('DOMContentLoaded', function() {
  const protectedPages = ['/profile', '/dashboard'];
  const currentPath = window.location.pathname;
  
  if (protectedPages.includes(currentPath) && !window.authManager.isAuthenticated()) {
    window.location.href = '/login';
  }
}); 