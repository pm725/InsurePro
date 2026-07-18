const User = require('../models/User');
const Claim = require('../models/Claim');
const RiskProfile = require('../models/RiskProfile');
const QuizResult = require('../models/QuizResult');
const { Op } = require('sequelize');

// Middleware: Check if user is admin (we'll use a simple role flag)
// For now, we'll treat user with id=1 as admin (or you can add a role column)
const isAdmin = async (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    // Check if user is admin (email contains 'admin' or id=1)
    const user = await User.findByPk(req.session.user.id);
    if (user.email.includes('admin') || user.id === 1) {
        return next();
    }
    res.status(403).send('Access denied. Admins only.');
};

// Admin Dashboard
exports.dashboard = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalClaims = await Claim.count();
        const pendingClaims = await Claim.count({ where: { status: 'Pending' } });
        const avgRisk = await RiskProfile.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('risk_score')), 'avgRisk']],
            raw: true
        });
        const recentUsers = await User.findAll({ limit: 5, order: [['createdAt', 'DESC']] });
        const recentClaims = await Claim.findAll({ limit: 5, order: [['createdAt', 'DESC']] });

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.session.user,
            totalUsers,
            totalClaims,
            pendingClaims,
            avgRisk: avgRisk.avgRisk || 0,
            recentUsers,
            recentClaims,
            error: null,
            success: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Admin dashboard error');
    }
};

// View all users
exports.users = async (req, res) => {
    try {
        const users = await User.findAll({ order: [['createdAt', 'DESC']] });
        res.render('admin/users', { title: 'Manage Users', user: req.session.user, users, error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading users');
    }
};

// View all claims (admin)
exports.claims = async (req, res) => {
    try {
        const allClaims = await Claim.findAll({
            include: [{ model: User, attributes: ['username', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.render('admin/claims', { title: 'Manage Claims', user: req.session.user, claims: allClaims, error: null, success: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading claims');
    }
};

// Update claim status (approve/reject)
exports.updateClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Approved' or 'Rejected'
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

// Delete user (admin)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
};

module.exports = { isAdmin, dashboard, users, claims, updateClaim, deleteUser };