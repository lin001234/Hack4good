require('dotenv').config();
const ssh = require('http');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const server=http.createServer(app);
const mainRoute = require('./src/routes/route');
const PORT = process.env.PORT || 8000;

//middleware
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration (espress-session)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, //(This cause cookies to be sent over HTTPS)process.env.NODE_ENV === 'production',
    maxAge: 86400000, // 24 hours
    httpOnly: true,
    samesite: 'none',
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', mainRoutes);
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// root route FOR NOW(Change after frontend created)
app.get('/', (req, res) => {
  res.send('API Server is running. No frontend is connected.');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
