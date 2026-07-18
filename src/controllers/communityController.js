const Tip = require('../models/Tip');
const TipComment = require('../models/TipComment');
const TipUpvote = require('../models/TipUpvote');
const User = require('../models/User');
const { Op } = require('sequelize');

// Show all tips (feed)
exports.tips = async (req, res) => {
    try {
        const allTips = await Tip.findAll({
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.render('community/tips', {
            title: 'Community Tips',
            user: req.session.user,
            tips: allTips,
            error: null,
            success: null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading tips');
    }
};

// Show form to create a new tip
exports.newTipForm = (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('community/new-tip', {
        title: 'Share a Health Tip',
        user: req.session.user,
        error: null,
        success: null
    });
};

// Submit a new tip
exports.createTip = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.render('community/new-tip', {
                title: 'Share a Health Tip',
                user: req.session.user,
                error: 'Title and content are required',
                success: null
            });
        }
        await Tip.create({
            user_id: req.session.user.id,
            title,
            content,
            upvotes: 0
        });
        res.redirect('/community/tips');
    } catch (err) {
        console.error(err);
        res.render('community/new-tip', {
            title: 'Share a Health Tip',
            user: req.session.user,
            error: 'Error creating tip. Please try again.',
            success: null
        });
    }
};

// View a single tip with comments
exports.tipDetail = async (req, res) => {
    try {
        const tip = await Tip.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['username'] }]
        });
        if (!tip) return res.status(404).send('Tip not found');
        const comments = await TipComment.findAll({
            where: { tip_id: tip.id },
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'ASC']]
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
        console.error(err);
        res.status(500).send('Error loading tip');
    }
};

// Upvote a tip
exports.upvote = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const tip = await Tip.findByPk(req.params.id);
        if (!tip) return res.status(404).send('Tip not found');
        // Check if already upvoted
        const existing = await TipUpvote.findOne({
            where: { tip_id: tip.id, user_id: req.session.user.id }
        });
        if (existing) {
            // Already upvoted – optionally remove upvote (toggle)
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
        console.error(err);
        res.status(500).send('Error upvoting');
    }
};

// Add comment to a tip
exports.addComment = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
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
        console.error(err);
        res.status(500).send('Error adding comment');
    }
};

module.exports = { tips, newTipForm, createTip, tipDetail, upvote, addComment };