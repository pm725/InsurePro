const User = require('../models/User');
const RiskProfile = require('../models/RiskProfile');

// Show login page
exports.showLogin = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('auth/login', { 
        title: 'Login',
        error: null,
        success: null
    });
};

// Process login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid email or password',
                success: null
            });
        }
        
        // Validate password
        const isValid = await user.validatePassword(password);
        
        if (!isValid) {
            return res.render('auth/login', {
                title: 'Login',
                error: 'Invalid email or password',
                success: null
            });
        }
        
        // Store user in session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            age: user.age,
            bmi: user.bmi,
            smoking: user.smoking
        };
        
        res.redirect('/dashboard');
        
    } catch (error) {
        console.error(error);
        res.render('auth/login', {
            title: 'Login',
            error: 'Something went wrong. Please try again.',
            success: null
        });
    }
};

// Show register page
exports.showRegister = (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('auth/register', { 
        title: 'Register',
        error: null,
        success: null
    });
};

// Process registration
exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        
        // Validate
        if (password !== confirmPassword) {
            return res.render('auth/register', {
                title: 'Register',
                error: 'Passwords do not match',
                success: null
            });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ 
            where: { 
                [require('sequelize').Op.or]: [
                    { email },
                    { username }
                ]
            }
        });
        
        if (existingUser) {
            return res.render('auth/register', {
                title: 'Register',
                error: 'Username or email already exists',
                success: null
            });
        }
        
        // Create user
        const user = await User.create({
            username,
            email,
            password
        });
        
        // Create initial risk profile
        await RiskProfile.create({
            user_id: user.id,
            risk_score: 0,
            premium: 50.00
        });
        
        res.render('auth/login', {
            title: 'Login',
            error: null,
            success: 'Registration successful! Please login.'
        });
        
    } catch (error) {
        console.error(error);
        res.render('auth/register', {
            title: 'Register',
            error: 'Something went wrong. Please try again.',
            success: null
        });
    }
};

// Logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
};