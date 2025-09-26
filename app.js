const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const morgan = require('morgan');

// Database
const { syncDatabase } = require('./models');

// Push Notification Services
const { registerDeviceToken, sendToSingleDevice, sendToAllDevices } = require('./services/pushService');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const pagesRouter = require('./routes/pages');
const authRouter = require('./routes/auth');

const app = express();


// ================= CORS ===================
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


// ================= Firebase (désactivé) ===================
// const admin = require("firebase-admin");
// const serviceAccount = require("./romaric-projet-firebase-adminsdk-fbsvc-794889836c.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });


// ================== Init DB ===================
syncDatabase()
  .then(() => console.log('🚀 Application ready with database synchronized'))
  .catch(error => console.error('❌ Failed to initialize database:', error));


// ================= View Engine =================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// ================= Middlewares =================

// Logger HTTP (toutes requêtes entrantes)
app.use(morgan('dev'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ================= Session =================
app.use(session({
  secret: 'platform-web-test-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true si HTTPS
    httpOnly: true
  }
}));

app.use(flash());

// Global variables for views (Flash messages)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// ================= Routes =================
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/pages', pagesRouter);
app.use('/auth', authRouter);


// ================= Notifications =================
app.post('/api/register-token', (req, res) => {
  const { token } = req.body;
  const success = registerDeviceToken(token);

  if (success) {
    console.log('📱 Device token registered:', token);
    return res.status(200).json({ message: 'Jeton enregistré avec succès' });
  } else {
    return res.status(400).json({ error: 'Jeton invalide ou déjà enregistré' });
  }
});

app.post('/api/send-notification', async (req, res) => {
  const { token, title, body, data } = req.body;
  console.log('🔔 Sending notification to single device');

  try {
    const result = await sendToSingleDevice(token, title, body, data);
    if (result.success) {
      return res.status(200).json({ message: 'Notification envoyée avec succès', result });
    } else {
      return res.status(500).json({ error: 'Erreur lors de l\'envoi', details: result.error });
    }
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

app.post('/api/send-notification-all', async (req, res) => {
  const { title, body, data } = req.body;
  console.log('🔔 Sending notification to all devices');

  try {
    const result = await sendToAllDevices(title, body, data);
    return res.status(200).json({ 
      message: 'Notifications envoyées avec succès',
      successCount: result.successCount,
      failureCount: result.failureCount,
      results: result.results
    });
  } catch (error) {
    console.error('❌ Error sending notifications:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});


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
