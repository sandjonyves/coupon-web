const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const favicon = require("serve-favicon");

// ================= Database =================
const { sequelize, syncDatabase } = require('./models');

// ================= Routes =================
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const pagesRouter = require('./routes/pages');
const authRouter = require('./routes/auth');

const app = express();

// ================================= CORS =======================================
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:19006',
    'exp://localhost:19000',
    'http://192.168.162.150:3001',
    'http://192.168.162.150:3000',
    'http://192.168.162.150:8081',
    'http://192.168.162.150:19006',
    'exp://192.168.160.150:8081',
    'exp://192.168.160.150:8082'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ================= Init DB ===================
const initializeDatabase = async () => {
  try {
    console.log("🔄 Starting database initialization...");
    
    // Supprime la table temporaire si elle existe pour éviter l'erreur de contrainte UNIQUE
    await sequelize.getQueryInterface().dropTable('coupons_backup').catch(() => {
      console.log("ℹ️ No backup table to drop");
    });
    
    console.log("🔄 Syncing database...");
    await syncDatabase();
    console.log('🚀 Application ready with database synchronized');
  } catch (error) {
    console.error('❌ Unable to connect to the database or sync models:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    // En production, on peut continuer sans la DB pour éviter les crashes
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Continuing without database synchronization in production');
      console.log('⚠️ Some features may not work properly');
    } else {
      // En développement, on peut faire crasher pour debug
      throw error;
    }
  }
};

// Initialiser la DB seulement si on n'est pas en train de tester
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch(error => {
    console.error('💥 Critical database error:', error);
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Attempting to continue without database...');
    } else {
      process.exit(1);
    }
  });
}

// ================= View Engine =================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ================= Middlewares =================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, "public", "images", "logo.png")));
app.use(express.static(path.join(__dirname, 'public')));

// ================= Session =================
// Configuration des sessions pour la production
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'platform-web-test-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
};

// En production, utiliser un store de session persistant
if (process.env.NODE_ENV === 'production') {
  // Pour Render, on peut utiliser connect-redis ou simplement désactiver les sessions
  // Pour l'instant, on utilise MemoryStore mais avec des avertissements supprimés
  console.log('⚠️ Production: Using MemoryStore for sessions (consider Redis for scaling)');
} else {
  console.log('🔧 Development: Using MemoryStore for sessions');
}

app.use(session(sessionConfig));

app.use(flash());

// ================= Flash Messages (global vars) =================
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// ================= Routes =================
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/pages', pagesRouter);
app.use('/auth', authRouter);

// ================= Health Check =================
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Serveur OK' });
});

// ================= 404 & Error Handler =================
app.use((req, res, next) => {
  const err = createError(404, 'Page non trouvée');
  next(err);
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur détectée :', err.message);

  // Si la requête provient de l'API → on renvoie du JSON
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Erreur interne du serveur',
      status: err.status || 500
    });
  }

  // Sinon → on rend une page HTML avec EJS
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', {
    title: `Erreur ${err.status || 500}`,
    message: err.message,
    error: err
  });
});

module.exports = app;
