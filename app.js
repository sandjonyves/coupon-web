var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var cors = require('cors');

// Import database sync
const { syncDatabase } = require('./models');

// Import push notification service
const { registerDeviceToken, sendToSingleDevice, sendToAllDevices } = require('./services/pushService');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var pagesRouter = require('./routes/pages');
var authRouter = require('./routes/auth');

var app = express();

// CORS configuration for React Native and web clients
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

// Firebase Admin SDK configuration
var admin = require("firebase-admin");
// var serviceAccount = require("./romaric-projet-firebase-adminsdk-fbsvc-794889836c.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// Initialize database
syncDatabase().then(() => {
  console.log('🚀 Application ready with database synchronized');
}).catch(error => {
  console.error('❌ Failed to initialize database:', error);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'platform-web-test-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Flash messages
app.use(flash());

// Global variables for views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/pages', pagesRouter);
app.use('/auth', authRouter);

// Push notification endpoints
app.post('/api/register-token', (req, res) => {
  const { token } = req.body;
  const success = registerDeviceToken(token);
  
  if (success) {
    console.log('📱 Device token registered:', token);
    res.status(200).json({ message: 'Jeton enregistré avec succès' });
  } else {
    res.status(400).json({ error: 'Jeton invalide ou déjà enregistré' });
  }
});

app.post('/api/send-notification', async (req, res) => {
  const { token, title, body, data } = req.body;

  try {
    const result = await sendToSingleDevice(token, title, body, data);
    if (result.success) {
      console.log('Notification sent successfully');
      res.status(200).json({ message: 'Notification envoyée avec succès', result });
    } else {
      res.status(500).json({ error: 'Erreur lors de l\'envoi de la notification', details: result.error });
    }
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la notification', details: error.message });
  }
});

app.post('/api/send-notification-all', async (req, res) => {
  const { title, body, data } = req.body;

  try {
    const result = await sendToAllDevices(title, body, data);
    console.log(' Multicast notification sent:', result);
    res.status(200).json({ 
      message: 'Notifications envoyées avec succès', 
      successCount: result.successCount,
      failureCount: result.failureCount,
      results: result.results
    });
  } catch (error) {
    console.error(' Error sending multicast notification:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi des notifications', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Serveur OK' });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
