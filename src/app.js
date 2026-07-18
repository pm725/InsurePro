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

// ===== MIDDLEWARE (ORDER MATTERS!) =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// ✅ SESSION MUST COME BEFORE ROUTES
app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// ===== MAKE USER AVAILABLE IN ALL VIEWS =====
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    next();
});

// ===== ROUTES (AFTER SESSION) =====
app.use('/', authRoutes);
app.use('/', riskRoutes);
app.use('/', claimRoutes);
app.use('/', adminRoutes);        // ✅ Admin routes AFTER session
app.use('/', quizRoutes);
app.use('/', communityRoutes);
app.use('/', infoRoutes);

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

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`🚀 InsurePro running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`🔐 Login: http://localhost:${PORT}/login`);
});