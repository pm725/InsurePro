const User = require('../models/User');
const RiskProfile = require('../models/RiskProfile');
const { Op } = require('sequelize');

// ===== SHOW LOGIN PAGE =====
exports.showLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('auth/login', { 
        title: 'Login',
        user: null,
        error: null,
        success: null
    });
};

// ===== PROCESS LOGIN =====
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.render('auth/login', {
                title: 'Login',
                user: null,
                error: 'Please fill in all fields',
                success: null
            });
        }
        
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.render('auth/login', {
                title: 'Login',
                user: null,
                error: 'Invalid email or password',
                success: null
            });
        }
        
        const isValid = await user.validatePassword(password);
        
        if (!isValid) {
            return res.render('auth/login', {
                title: 'Login',
                user: null,
                error: 'Invalid email or password',
                success: null
            });
        }
        
        // Set session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            age: user.age,
            bmi: user.bmi,
            smoking: user.smoking
        };
        
        // ✅ Save session before redirect
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
            }
            return res.redirect('/dashboard');
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login',
            user: null,
            error: 'Something went wrong. Please try again.',
            success: null
        });
    }
};

// ===== SHOW REGISTER PAGE =====
exports.showRegister = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('auth/register', { 
        title: 'Register',
        user: null,
        error: null,
        success: null
    });
};

// ===== PROCESS REGISTRATION =====
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Validate
        if (!username || !email || !password || !confirmPassword) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: 'All fields are required',
                success: null
            });
        }
        
        if (password.length < 6) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: 'Password must be at least 6 characters',
                success: null
            });
        }
        
        if (password !== confirmPassword) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: 'Passwords do not match',
                success: null
            });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { email },
                    { username }
                ]
            }
        });
        
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: 'Username or email already exists',
                success: null
            });
        }
        
        // Create user
        const user = await User.create({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password
        });
        
        // Create initial risk profile
        await RiskProfile.create({
            user_id: user.id,
            risk_score: 0,
            premium: 50.00
        });
        
        // ✅ Redirect to login with success
        res.render('auth/login', {
            title: 'Login',
            user: null,
            error: null,
            success: '✅ Registration successful! Please login.'
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.render('auth/register', {
            title: 'Register',
            user: null,
            error: 'Something went wrong. Please try again.',
            success: null
        });
    }
};

// ===== LOGOUT - FIXED =====
exports.logout = (req, res) => {
    // ✅ Destroy session properly
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        // ✅ Clear cookie
        res.clearCookie('connect.sid');
        // ✅ Redirect to login
        res.redirect('/login');
    });
};