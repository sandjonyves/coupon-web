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

// ================= CORS ===================
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
    // ✅ Supprime la table temporaire si elle existe pour éviter l’erreur de contrainte UNIQUE
    await sequelize.getQueryInterface().dropTable('coupons_backup').catch(() => {});

    await syncDatabase();
    console.log('🚀 Application ready with database synchronized');
  } catch (error) {
    console.error('❌ Unable to connect to the database or sync models:', error);
  }
};
initializeDatabase();

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
app.use(session({
  secret: 'platform-web-test-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

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
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
