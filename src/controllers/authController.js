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
        
        if (!email || !password) {
            return res.render('auth/login', {
                title: 'Login',
                user: null,
                error: '⚠️ Please fill in all fields',
                success: null
            });
        }
        
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.render('auth/login', {
                title: 'Login',
                user: null,
                error: '❌ Invalid email or password',
                success: null
            });
        }
        
        const isValid = await user.validatePassword(password);
        
        if (!isValid) {
            return res.render('auth/login', {
                title: 'Login',
                user: null,
                error: '❌ Invalid email or password',
                success: null
            });
        }
        
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            age: user.age,
            bmi: user.bmi,
            smoking: user.smoking
        };
        
        req.session.save((err) => {
            if (err) console.error('Session save error:', err);
            return res.redirect('/dashboard');
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.render('auth/login', {
            title: 'Login',
            user: null,
            error: '⚠️ Something went wrong. Please try again.',
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

// ===== PROCESS REGISTRATION - WITH CLEAR ERRORS =====
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // ===== VALIDATION WITH CLEAR MESSAGES =====
        
        // 1. Check all fields filled
        if (!username || !email || !password || !confirmPassword) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: '⚠️ All fields are required. Please fill in everything.',
                success: null
            });
        }
        
        // 2. Username validation
        if (username.length < 3) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: '❌ Username must be at least 3 characters long. (You entered ' + username.length + ' characters)',
                success: null
            });
        }
        
        if (username.length > 50) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: '❌ Username must be less than 50 characters.',
                success: null
            });
        }
        
        // 3. Email validation
        if (!email.includes('@') || !email.includes('.')) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: '❌ Please enter a valid email address (e.g., name@domain.com)',
                success: null
            });
        }
        
        // 4. Password validation
        if (password.length < 6) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: '❌ Password must be at least 6 characters long. (You entered ' + password.length + ' characters)',
                success: null
            });
        }
        
        // 5. Password confirmation
        if (password !== confirmPassword) {
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: '❌ Passwords do not match. Please re-enter.',
                success: null
            });
        }
        
        // 6. Check if user already exists
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { email: email.trim().toLowerCase() },
                    { username: username.trim() }
                ]
            }
        });
        
        if (existingUser) {
            let errorMsg = '❌ ';
            if (existingUser.email === email.trim().toLowerCase()) {
                errorMsg += 'This email is already registered. Please use a different email or login.';
            } else {
                errorMsg += 'This username is already taken. Please choose a different username.';
            }
            return res.render('auth/register', {
                title: 'Register',
                user: null,
                error: errorMsg,
                success: null
            });
        }
        
        // ===== CREATE USER =====
        const user = await User.create({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: password
        });
        
        // Create initial risk profile
        await RiskProfile.create({
            user_id: user.id,
            risk_score: 0,
            premium: 50.00
        });
        
        // ===== SUCCESS =====
        res.render('auth/login', {
            title: 'Login',
            user: null,
            error: null,
            success: '✅ Registration successful! Welcome ' + user.username + '! Please login to continue.'
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        
        // ===== HANDLE DATABASE ERRORS =====
        let errorMsg = '⚠️ Something went wrong. Please try again.';
        
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => {
                if (e.path === 'username') return '❌ Username: ' + e.message;
                if (e.path === 'email') return '❌ Email: ' + e.message;
                return '❌ ' + e.message;
            });
            errorMsg = messages.join('. ');
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            errorMsg = '❌ Username or email already exists. Please try another.';
        }
        
        res.render('auth/register', {
            title: 'Register',
            user: null,
            error: errorMsg,
            success: null
        });
    }
};

// ===== LOGOUT =====
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Logout error:', err);
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};