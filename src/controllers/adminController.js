const User = require('../models/User');
const Claim = require('../models/Claim');
const RiskProfile = require('../models/RiskProfile');
const sequelize = require('../config/db');

// ===== ADMIN AUTH MIDDLEWARE =====
const isAdmin = async (req, res, next) => {
    // ✅ Check if session exists first
    if (!req.session) {
        console.log('❌ No session found');
        return res.status(403).send('Session not found. Please login.');
    }
    
    if (!req.session.user) {
        console.log('❌ User not logged in');
        return res.redirect('/login');
    }
    
    try {
        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            console.log('❌ User not found in database');
            return res.status(403).send('User not found.');
        }
        
        // Check if user is admin (email contains 'admin' OR id === 1)
        if (user.email.includes('admin') || user.id === 1) {
            console.log('✅ Admin access granted for:', user.email);
            return next();
        }
        
        console.log('❌ Access denied for:', user.email);
        res.status(403).send('Access denied. Admins only.');
    } catch (err) {
        console.error('❌ Admin check error:', err);
        res.status(500).send('Error checking admin status');
    }
};

// ===== ADMIN DASHBOARD =====
const dashboard = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalClaims = await Claim.count();
        const pendingClaims = await Claim.count({ where: { status: 'Pending' } });
        
        // Get average risk score
        const avgRiskResult = await RiskProfile.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('risk_score')), 'avgRisk']],
            raw: true
        });
        const avgRisk = avgRiskResult ? parseFloat(avgRiskResult.avgRisk) || 0 : 0;
        
        const recentUsers = await User.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });
        
        const recentClaims = await Claim.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, attributes: ['username'] }]
        });

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.session.user,
            totalUsers,
            totalClaims,
            pendingClaims,
            avgRisk: avgRisk.toFixed(1),
            recentUsers,
            recentClaims,
            error: null,
            success: null
        });
    } catch (err) {
        console.error('Admin dashboard error:', err);
        res.status(500).send('Admin dashboard error');
    }
};

// ===== VIEW ALL USERS =====
const users = async (req, res) => {
    try {
        const allUsers = await User.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.render('admin/users', {
            title: 'Manage Users',
            user: req.session.user,
            users: allUsers,
            error: null,
            success: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading users');
    }
};

// ===== VIEW ALL CLAIMS (ADMIN) =====
const claims = async (req, res) => {
    try {
        const allClaims = await Claim.findAll({
            include: [{ model: User, attributes: ['username', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.render('admin/claims', {
            title: 'Manage Claims',
            user: req.session.user,
            claims: allClaims,
            error: null,
            success: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading claims');
    }
};

// ===== UPDATE CLAIM STATUS =====
const updateClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const claim = await Claim.findByPk(id);
        if (!claim) {
            return res.status(404).send('Claim not found');
        }
        
        claim.status = status;
        await claim.save();
        res.redirect('/admin/claims');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating claim');
    }
};

// ===== DELETE USER =====
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
};

// ===== EXPORT ALL =====
module.exports = {
    isAdmin,
    dashboard,
    users,
    claims,
    updateClaim,
    deleteUser
};