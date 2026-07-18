const QuizResult = require('../models/QuizResult');
const RiskProfile = require('../models/RiskProfile');
const User = require('../models/User');

// Quiz questions
const questions = [
    { id: 1, question: 'How many times do you exercise per week?', options: ['0-1', '2-3', '4-5', '6+'], scores: [20, 10, 5, 0] },
    { id: 2, question: 'How many hours do you sleep on average?', options: ['<5', '5-6', '7-8', '9+'], scores: [20, 10, 0, 10] },
    { id: 3, question: 'How would you describe your diet?', options: ['Poor', 'Average', 'Good', 'Excellent'], scores: [25, 15, 5, 0] },
    { id: 4, question: 'How often do you consume alcohol?', options: ['Daily', 'Weekly', 'Rarely', 'Never'], scores: [25, 15, 5, 0] },
    { id: 5, question: 'How is your stress level?', options: ['High', 'Medium', 'Low', 'None'], scores: [20, 10, 5, 0] },
    { id: 6, question: 'Do you smoke or use tobacco?', options: ['Yes', 'No'], scores: [30, 0] },
    { id: 7, question: 'How often do you eat fast food?', options: ['Daily', 'Weekly', 'Monthly', 'Rarely'], scores: [20, 10, 5, 0] },
    { id: 8, question: 'How many glasses of water do you drink daily?', options: ['<2', '3-4', '5-6', '7+'], scores: [15, 10, 5, 0] },
    { id: 9, question: 'Do you have any chronic conditions?', options: ['Yes', 'No'], scores: [20, 0] },
    { id: 10, question: 'How often do you get health checkups?', options: ['Never', 'Rarely', 'Annually', 'Regularly'], scores: [15, 10, 5, 0] }
];

// ===== SHOW QUIZ START PAGE =====
const start = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('quiz/start', { 
        title: 'Health Habits Quiz', 
        user: req.session.user, 
        error: null 
    });
};

// ===== SHOW QUESTION BY STEP =====
const question = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const step = parseInt(req.params.step) || 0;
    if (step >= questions.length) {
        return res.redirect('/quiz/result');
    }
    const q = questions[step];
    res.render('quiz/question', { 
        title: 'Quiz', 
        user: req.session.user, 
        question: q, 
        step, 
        total: questions.length, 
        error: null 
    });
};

// ===== PROCESS ANSWER =====
const answer = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    try {
        const { step, answer } = req.body;
        const currentStep = parseInt(step);
        
        // Store answers in session (temporary)
        if (!req.session.quizAnswers) {
            req.session.quizAnswers = [];
        }
        req.session.quizAnswers[currentStep] = parseInt(answer);
        
        // Redirect to next question or result
        if (currentStep + 1 < questions.length) {
            res.redirect(`/quiz/question/${currentStep + 1}`);
        } else {
            // Calculate total score
            let total = 0;
            req.session.quizAnswers.forEach((selected, idx) => {
                const q = questions[idx];
                if (selected !== undefined && q.scores[selected] !== undefined) {
                    total += q.scores[selected] || 0;
                }
            });
            
            // Normalize to 0-100
            const maxPossible = questions.reduce((sum, q) => sum + Math.max(...q.scores), 0);
            const healthScore = Math.round((total / maxPossible) * 100);
            
            // Save to database
            await QuizResult.create({
                user_id: req.session.user.id,
                health_score: healthScore,
                answers: JSON.stringify(req.session.quizAnswers)
            });
            
            // Update risk profile based on health score
            const user = await User.findByPk(req.session.user.id);
            const bmi = user.bmi || 22;
            const age = user.age || 30;
            const smoking = user.smoking || false;
            
            // Recalculate risk with new health factor
            let riskScore = 0;
            if (age < 25) riskScore += 10;
            else if (age < 35) riskScore += 20;
            else if (age < 50) riskScore += 35;
            else riskScore += 50;
            
            if (bmi < 18.5) riskScore += 15;
            else if (bmi < 25) riskScore += 5;
            else if (bmi < 30) riskScore += 25;
            else riskScore += 40;
            
            if (smoking) riskScore += 30;
            
            // Health score adjustment: lower health score increases risk
            const healthFactor = Math.max(0, (100 - healthScore) / 2); // 0 to 50 points
            riskScore += Math.round(healthFactor);
            riskScore = Math.min(100, riskScore);
            
            const premium = 50 + (riskScore * 1.5);
            
            // Save new risk profile
            await RiskProfile.create({
                user_id: req.session.user.id,
                risk_score: riskScore,
                premium: Math.round(premium * 100) / 100,
                age,
                bmi,
                smoking
            });
            
            // Clear session answers
            delete req.session.quizAnswers;
            
            // Redirect to result
            res.redirect(`/quiz/result?score=${healthScore}`);
        }
    } catch (err) {
        console.error('Quiz answer error:', err);
        res.status(500).send('Error processing quiz answer');
    }
};

// ===== SHOW QUIZ RESULT =====
const result = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    
    try {
        const score = parseInt(req.query.score) || 0;
        const latestResult = await QuizResult.findOne({
            where: { user_id: req.session.user.id },
            order: [['completed_at', 'DESC']]
        });
        
        res.render('quiz/result', {
            title: 'Quiz Result',
            user: req.session.user,
            score: latestResult ? latestResult.health_score : score,
            error: null
        });
    } catch (err) {
        console.error('Quiz result error:', err);
        res.status(500).send('Error loading quiz result');
    }
};

// ===== EXPORT ALL =====
module.exports = { 
    questions, 
    start, 
    question, 
    answer, 
    result 
};