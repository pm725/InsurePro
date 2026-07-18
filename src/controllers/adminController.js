const User = require('../models/User');
const Claim = require('../models/Claim');
const RiskProfile = require('../models/RiskProfile');
const QuizResult = require('../models/QuizResult');
const Tip = require('../models/Tip');
const sequelize = require('../config/db');

// ============================================
// ADMIN AUTH MIDDLEWARE
// ============================================
const isAdmin = async (req, res, next) => {
    // Check if session exists
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
        return res.status(403).render('error', {
            title: 'Access Denied',
            user: req.session.user,
            message: 'You do not have admin privileges.',
            error: 'Only administrators can access this page.'
        });
    } catch (err) {
        console.error('❌ Admin check error:', err);
        res.status(500).send('Error checking admin status');
    }
};

// ============================================
// ADMIN DASHBOARD - Complete Overview
// ============================================
const dashboard = async (req, res) => {
    try {
        // Stats
        const totalUsers = await User.count();
        const totalClaims = await Claim.count();
        const pendingClaims = await Claim.count({ where: { status: 'Pending' } });
        const approvedClaims = await Claim.count({ where: { status: 'Approved' } });
        const rejectedClaims = await Claim.count({ where: { status: 'Rejected' } });
        const totalQuizzes = await QuizResult.count();
        
        // Average risk score
        const avgRiskResult = await RiskProfile.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('risk_score')), 'avgRisk']],
            raw: true
        });
        const avgRisk = avgRiskResult ? parseFloat(avgRiskResult.avgRisk) || 0 : 0;
        
        // Average health score from quizzes
        const avgHealthResult = await QuizResult.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('health_score')), 'avgHealth']],
            raw: true
        });
        const avgHealth = avgHealthResult ? parseFloat(avgHealthResult.avgHealth) || 0 : 0;
        
        // Recent users
        const recentUsers = await User.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']]
        });
        
        // Recent claims with user info
        const recentClaims = await Claim.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [{ model: User, attributes: ['username', 'email'] }]
        });
        
        // Recent quiz results
        const recentQuizzes = await QuizResult.findAll({
            limit: 5,
            order: [['completed_at', 'DESC']],
            include: [{ model: User, attributes: ['username', 'email'] }]
        });

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.session.user,
            totalUsers,
            totalClaims,
            pendingClaims,
            approvedClaims,
            rejectedClaims,
            totalQuizzes,
            avgRisk: avgRisk.toFixed(1),
            avgHealth: avgHealth.toFixed(1),
            recentUsers,
            recentClaims,
            recentQuizzes,
            error: null,
            success: null
        });
    } catch (err) {
        console.error('Admin dashboard error:', err);
        res.status(500).send('Admin dashboard error');
    }
};

// ============================================
// MANAGE USERS
// ============================================
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

// ============================================
// DELETE USER (with cascade)
// ============================================
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Don't allow deleting yourself
        if (parseInt(id) === req.session.user.id) {
            return res.redirect('/admin/users?error=Cannot delete yourself');
        }
        
        // Delete user (cascade will delete related records)
        await User.destroy({ where: { id } });
        res.redirect('/admin/users?success=User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
};

// ============================================
// MANAGE CLAIMS - View All
// ============================================
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

// ============================================
// UPDATE CLAIM STATUS (Approve/Reject)
// ============================================
const updateClaim = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Approved' or 'Rejected'
        
        const claim = await Claim.findByPk(id);
        if (!claim) {
            return res.status(404).send('Claim not found');
        }
        
        claim.status = status;
        await claim.save();
        
        console.log(`✅ Claim #${id} ${status} by admin`);
        res.redirect('/admin/claims?success=Claim updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating claim');
    }
};

// ============================================
// VIEW QUIZ RESULTS
// ============================================
const quizzes = async (req, res) => {
    try {
        const allQuizzes = await QuizResult.findAll({
            include: [{ model: User, attributes: ['username', 'email'] }],
            order: [['completed_at', 'DESC']]
        });
        res.render('admin/quizzes', {
            title: 'Quiz Results',
            user: req.session.user,
            quizzes: allQuizzes,
            error: null,
            success: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading quiz results');
    }
};

// ============================================
// VIEW USER DETAILS (with all their data)
// ============================================
const userDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        
        const riskProfiles = await RiskProfile.findAll({
            where: { user_id: id },
            order: [['createdAt', 'DESC']]
        });
        
        const userClaims = await Claim.findAll({
            where: { user_id: id },
            order: [['createdAt', 'DESC']]
        });
        
        const quizResults = await QuizResult.findAll({
            where: { user_id: id },
            order: [['completed_at', 'DESC']]
        });
        
        res.render('admin/user-details', {
            title: `User: ${user.username}`,
            user: req.session.user,
            targetUser: user,
            riskProfiles,
            userClaims,
            quizResults,
            error: null,
            success: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading user details');
    }
};

// ============================================
// EXPORT ALL
// ============================================
module.exports = {
    isAdmin,
    dashboard,
    users,
    deleteUser,
    claims,
    updateClaim,
    quizzes,
    userDetails
};