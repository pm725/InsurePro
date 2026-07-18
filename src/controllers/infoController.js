// ===== INFO CONTROLLER =====
// No models needed for info pages (static content)

// ===== MAIN INFO HUB =====
const index = (req, res) => {
    res.render('info/index', {
        title: 'Learn About Your Health Metrics',
        user: req.session.user || null,
        error: null,
        success: null
    });
};

// ===== BMI EXPLAINED =====
const bmi = (req, res) => {
    res.render('info/bmi', {
        title: 'BMI Explained',
        user: req.session.user || null,
        error: null,
        success: null
    });
};

// ===== RISK SCORE EXPLAINED =====
const riskScore = (req, res) => {
    res.render('info/risk-score', {
        title: 'Risk Score Explained',
        user: req.session.user || null,
        error: null,
        success: null
    });
};

// ===== PREMIUM EXPLAINED =====
const premium = (req, res) => {
    res.render('info/premium', {
        title: 'Premium Explained',
        user: req.session.user || null,
        error: null,
        success: null
    });
};

// ===== HEALTH SCORE EXPLAINED =====
const healthScore = (req, res) => {
    res.render('info/health-score', {
        title: 'Health Score Explained',
        user: req.session.user || null,
        error: null,
        success: null
    });
};

// ===== GLOSSARY =====
const glossary = (req, res) => {
    res.render('info/glossary', {
        title: 'Health Metrics Glossary',
        user: req.session.user || null,
        error: null,
        success: null
    });
};

// ===== EXPORT ALL =====
module.exports = {
    index,
    bmi,
    riskScore,
    premium,
    healthScore,
    glossary
};