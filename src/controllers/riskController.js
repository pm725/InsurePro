const RiskProfile = require('../models/RiskProfile');
const User = require('../models/User');
const { Op } = require('sequelize');

// Show risk form
exports.showRiskForm = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('risk-form', {
        title: 'Calculate Risk',
        user: req.session.user,
        result: null,
        error: null,      // ← ADD THIS
        success: null     // ← ADD THIS
    });
};

// Calculate risk
exports.calculateRisk = async (req, res) => {
    try {
        const { age, bmi, smoking } = req.body;
        const userId = req.session.user.id;
        
        // Convert to numbers
        const ageNum = parseInt(age);
        const bmiNum = parseFloat(bmi);
        const smokingBool = smoking === 'on' || smoking === 'true';
        
        // Validation
        if (!ageNum || !bmiNum) {
            return res.render('risk-form', {
                title: 'Calculate Risk',
                user: req.session.user,
                result: null,
                error: 'Please fill in all fields correctly.',
                success: null
            });
        }
        
        // Risk calculation algorithm
        let riskScore = 0;
        
        // Age factor
        if (ageNum < 25) riskScore += 10;
        else if (ageNum < 35) riskScore += 20;
        else if (ageNum < 50) riskScore += 35;
        else riskScore += 50;
        
        // BMI factor
        if (bmiNum < 18.5) riskScore += 15;
        else if (bmiNum < 25) riskScore += 5;
        else if (bmiNum < 30) riskScore += 25;
        else riskScore += 40;
        
        // Smoking factor
        if (smokingBool) riskScore += 30;
        
        // Premium calculation (base $50 + risk factors)
        let premium = 50 + (riskScore * 1.5);
        premium = Math.round(premium * 100) / 100;
        
        // Save risk profile
        await RiskProfile.create({
            user_id: userId,
            risk_score: riskScore,
            premium: premium,
            age: ageNum,
            bmi: bmiNum,
            smoking: smokingBool
        });
        
        // Update user
        await User.update({
            age: ageNum,
            bmi: bmiNum,
            smoking: smokingBool
        }, {
            where: { id: userId }
        });
        
        // Update session
        req.session.user.age = ageNum;
        req.session.user.bmi = bmiNum;
        req.session.user.smoking = smokingBool;
        
        // Get risk level
        let riskLevel = 'Low';
        if (riskScore > 70) riskLevel = 'High';
        else if (riskScore > 40) riskLevel = 'Medium';
        
        res.render('risk-form', {
            title: 'Risk Result',
            user: req.session.user,
            result: {
                riskScore,
                premium,
                riskLevel,
                age: ageNum,
                bmi: bmiNum,
                smoking: smokingBool
            },
            error: null,
            success: null
        });
        
    } catch (error) {
        console.error(error);
        res.render('risk-form', {
            title: 'Calculate Risk',
            user: req.session.user,
            result: null,
            error: 'Error calculating risk. Please try again.',
            success: null
        });
    }
};

// Show dashboard
exports.showDashboard = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        const userId = req.session.user.id;
        const UserModel = require('../models/User');
        const Claim = require('../models/Claim');
        
        // Get latest risk profile
        const latestRisk = await RiskProfile.findOne({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });
        
        // Get all risk history for chart
        const riskHistory = await RiskProfile.findAll({
            where: { user_id: userId },
            attributes: ['createdAt', 'risk_score', 'premium'],
            order: [['createdAt', 'ASC']],
            limit: 10
        });
        
        // Get claims
        const claims = await Claim.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        
        const claimsCount = await Claim.count({ where: { user_id: userId } });
        const pendingClaims = await Claim.count({ 
            where: { user_id: userId, status: 'Pending' } 
        });
        
        // Format data for chart
        const chartData = riskHistory.map(r => ({
            date: r.createdAt ? r.createdAt.toISOString().split('T')[0] : 'N/A',
            score: r.risk_score || 0,
            premium: parseFloat(r.premium) || 0
        }));
        
        res.render('dashboard', {
            title: 'Dashboard',
            user: req.session.user,
            riskProfile: latestRisk,
            chartData: JSON.stringify(chartData),
            claims: claims || [],
            claimsCount: claimsCount || 0,
            pendingClaims: pendingClaims || 0,
            error: null,
            success: null
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading dashboard');
    }
};