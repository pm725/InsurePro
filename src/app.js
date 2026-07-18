const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== IMPORT ROUTES =====
const authRoutes = require('./routes/authRoutes');
const riskRoutes = require('./routes/riskRoutes');
const claimRoutes = require('./routes/claimRoutes');
const adminRoutes = require('./routes/adminRoutes');
const quizRoutes = require('./routes/quizRoutes');
const communityRoutes = require('./routes/communityRoutes');
const infoRoutes = require('./routes/infoRoutes');

// ===== VIEW ENGINE =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// ===== SESSION - PROPERLY CONFIGURED =====
app.use(session({
    secret: process.env.SESSION_SECRET || 'insurepro-secret-key-2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: false // Set to true if using HTTPS
    }
}));

// ===== MAKE USER AVAILABLE TO ALL VIEWS =====
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    next();
});

// ===== ROUTES =====
app.use('/', authRoutes);        // Login, Register, Logout
app.use('/', riskRoutes);        // Dashboard, Risk Calculator
app.use('/', claimRoutes);       // Claims
app.use('/', quizRoutes);        // Health Quiz
app.use('/', communityRoutes);   // Community
app.use('/', infoRoutes);        // Learn
app.use('/', adminRoutes);       // Admin
// ===== HOMEPAGE =====
app.get('/', (req, res) => {
    if (req.session?.user) {
        return res.redirect('/dashboard');
    }
    res.render('index', { 
        title: 'InsurePro - Smart Health Insurance',
        user: null,
        error: null,
        success: null
    });
});

// ===== 404 ERROR HANDLING =====
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">Go Home</a>
    `);
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`🚀 InsurePro running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
    console.log(`📝 Register: http://localhost:${PORT}/register`);
});