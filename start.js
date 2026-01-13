#!/usr/bin/env node

// Script de démarrage robuste pour Render
console.log(' Starting application...');
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
console.log('🔧 Port:', process.env.PORT || '3000');
console.log('🔧 Database URL exists:', !!process.env.DATABASE_URL);

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  if (process.env.NODE_ENV === 'production') {
    console.log(' Attempting to continue...');
  } else {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  if (process.env.NODE_ENV === 'production') {
    console.log(' Attempting to continue...');
  } else {
    process.exit(1);
  }
});

// Démarrer l'application
try {
  require('./bin/www');
} catch (error) {
  console.error('💥 Failed to start application:', error);
  process.exit(1);
}
