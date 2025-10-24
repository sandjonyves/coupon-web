#!/usr/bin/env node

// Script de diagnostic pour Render
console.log('🔍 Diagnostic de l\'application...');

// Vérifier les variables d'environnement
console.log('📋 Variables d\'environnement:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('- SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
console.log('- SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);

// Vérifier les fichiers
const fs = require('fs');
const path = require('path');

console.log('\n📁 Vérification des fichiers:');
const filesToCheck = [
  'app.js',
  'bin/www',
  'start.js',
  'package.json',
  'views/home.ejs',
  'views/index.ejs',
  'controllers/pageController.js',
  'routes/pages.js'
];

filesToCheck.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`- ${file}: ${exists ? '✅' : '❌'}`);
});

// Vérifier les dépendances
console.log('\n📦 Vérification des dépendances:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('- Express:', packageJson.dependencies.express);
  console.log('- EJS:', packageJson.dependencies.ejs);
  console.log('- Sequelize:', packageJson.dependencies.sequelize);
} catch (error) {
  console.log('❌ Erreur lecture package.json:', error.message);
}

console.log('\n✅ Diagnostic terminé');
