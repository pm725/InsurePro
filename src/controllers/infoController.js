const User = require('../models/User');
const UserActivity = require('../models/UserActivity');

// Main info hub
exports.index = (req, res) => {
    // Log activity if user is logged in
    if (req.session.user) {
        UserActivity.create({
            user_id: req.session.user.id,
            activity_type: 'view',
            page: 'info-hub'
        }).catch(() => {});
    }
    res.render('info/index', {
        title: 'Learn About Your Health Metrics',
        user: req.session.user,
        error: null,
        success: null
    });
};

// BMI explained
exports.bmi = (req, res) => {
    if (req.session.user) {
        UserActivity.create({
            user_id: req.session.user.id,
            activity_type: 'view',
            page: 'info-bmi'
        }).catch(() => {});
    }
    res.render('info/bmi', {
        title: 'BMI Explained',
        user: req.session.user,
        error: null,
        success: null
    });
};

// Risk Score explained
exports.riskScore = (req, res) => {
    if (req.session.user) {
        UserActivity.create({
            user_id: req.session.user.id,
            activity_type: 'view',
            page: 'info-risk-score'
        }).catch(() => {});
    }
    res.render('info/risk-score', {
        title: 'Risk Score Explained',
        user: req.session.user,
        error: null,
        success: null
    });
};

// Premium explained
exports.premium = (req, res) => {
    if (req.session.user) {
        UserActivity.create({
            user_id: req.session.user.id,
            activity_type: 'view',
            page: 'info-premium'
        }).catch(() => {});
    }
    res.render('info/premium', {
        title: 'Premium Explained',
        user: req.session.user,
        error: null,
        success: null
    });
};

// Health Score explained
exports.healthScore = (req, res) => {
    if (req.session.user) {
        UserActivity.create({
            user_id: req.session.user.id,
            activity_type: 'view',
            page: 'info-health-score'
        }).catch(() => {});
    }
    res.render('info/health-score', {
        title: 'Health Score Explained',
        user: req.session.user,
        error: null,
        success: null
    });
};

// Glossary
exports.glossary = (req, res) => {
    if (req.session.user) {
        UserActivity.create({
            user_id: req.session.user.id,
            activity_type: 'view',
            page: 'info-glossary'
        }).catch(() => {});
    }
    res.render('info/glossary', {
        title: 'Health Metrics Glossary',
        user: req.session.user,
        error: null,
        success: null
    });
};

module.exports = { index, bmi, riskScore, premium, healthScore, glossary };