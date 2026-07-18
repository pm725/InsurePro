const Tip = require('../models/Tip');
const TipComment = require('../models/TipComment');
const TipUpvote = require('../models/TipUpvote');
const User = require('../models/User');
const { Op } = require('sequelize');

// ===== SHOW ALL TIPS (FEED) =====
const tips = async (req, res) => {
    try {
        const allTips = await Tip.findAll({
            include: [{ model: User, attributes: ['username'] }],
            order: [['created_at', 'DESC']]
        });
        res.render('community/tips', {
            title: 'Community Tips',
            user: req.session.user || null,
            tips: allTips || [],
            error: null,
            success: null
        });
    } catch (err) {
        console.error('Error loading tips:', err);
        res.render('community/tips', {
            title: 'Community Tips',
            user: req.session.user || null,
            tips: [],
            error: 'Error loading tips. Please try again.',
            success: null
        });
    }
};
// ===== SHOW FORM TO CREATE A NEW TIP =====
const newTipForm = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('community/new-tip', {
        title: 'Share a Health Tip',
        user: req.session.user,
        error: null,
        success: null
    });
};

// ===== SUBMIT A NEW TIP =====
const createTip = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const { title, content } = req.body;
        
        // Validation
        if (!title || !content) {
            return res.render('community/new-tip', {
                title: 'Share a Health Tip',
                user: req.session.user,
                error: 'Title and content are required',
                success: null
            });
        }
        
        // Create tip
        await Tip.create({
            user_id: req.session.user.id,
            title: title.trim(),
            content: content.trim(),
            upvotes: 0
        });
        
        // ✅ Redirect with success
        res.redirect('/community/tips');
        
    } catch (err) {
        console.error('Error creating tip:', err);
        res.render('community/new-tip', {
            title: 'Share a Health Tip',
            user: req.session.user,
            error: 'Error creating tip. Please try again.',
            success: null
        });
    }
};

// ===== VIEW A SINGLE TIP WITH COMMENTS =====
const tipDetail = async (req, res) => {
    try {
        const tip = await Tip.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['username'] }]
        });
        if (!tip) {
            return res.status(404).send('Tip not found');
        }
        
        const comments = await TipComment.findAll({
            where: { tip_id: tip.id },
            include: [{ model: User, attributes: ['username'] }],
            order: [['created_at', 'ASC']]
        });
        
        // Check if user already upvoted
        let userUpvoted = false;
        if (req.session.user) {
            const existing = await TipUpvote.findOne({
                where: { tip_id: tip.id, user_id: req.session.user.id }
            });
            userUpvoted = !!existing;
        }
        
        res.render('community/tip-detail', {
            title: tip.title,
            user: req.session.user,
            tip,
            comments,
            userUpvoted,
            error: null,
            success: null
        });
    } catch (err) {
        console.error('Error loading tip detail:', err);
        res.status(500).send('Error loading tip');
    }
};

// ===== UPVOTE A TIP =====
const upvote = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const tip = await Tip.findByPk(req.params.id);
        if (!tip) {
            return res.status(404).send('Tip not found');
        }
        
        // Check if already upvoted
        const existing = await TipUpvote.findOne({
            where: { tip_id: tip.id, user_id: req.session.user.id }
        });
        
        if (existing) {
            // Already upvoted – remove upvote (toggle)
            await existing.destroy();
            tip.upvotes = Math.max(0, tip.upvotes - 1);
        } else {
            await TipUpvote.create({
                tip_id: tip.id,
                user_id: req.session.user.id
            });
            tip.upvotes += 1;
        }
        await tip.save();
        res.redirect(`/community/tip/${tip.id}`);
    } catch (err) {
        console.error('Error upvoting:', err);
        res.status(500).send('Error upvoting');
    }
};

// ===== ADD COMMENT TO A TIP =====
const addComment = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    try {
        const { comment } = req.body;
        if (!comment || comment.length < 2) {
            return res.redirect(`/community/tip/${req.params.id}?error=Comment too short`);
        }
        await TipComment.create({
            tip_id: req.params.id,
            user_id: req.session.user.id,
            comment
        });
        res.redirect(`/community/tip/${req.params.id}`);
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).send('Error adding comment');
    }
};

// ===== EXPORT ALL =====
module.exports = { 
    tips, 
    newTipForm, 
    createTip, 
    tipDetail, 
    upvote, 
    addComment 
};