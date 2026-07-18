const Claim = require('../models/Claim');
const path = require('path');
const fs = require('fs');

// Show claim form
exports.showClaimForm = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('claim-form', {
        title: 'File a Claim',
        user: req.session.user,
        success: null,
        error: null
    });
};

// File a claim
exports.fileClaim = async (req, res) => {
    try {
        const { description } = req.body;
        const userId = req.session.user.id;
        
        // Validate
        if (!description || description.length < 10) {
            return res.render('claim-form', {
                title: 'File a Claim',
                user: req.session.user,
                error: 'Please provide a detailed description (minimum 10 characters)',
                success: null
            });
        }
        
        // Handle file upload
        let documentPath = null;
        if (req.file) {
            documentPath = req.file.path;
        }
        
        // Create claim
        await Claim.create({
            user_id: userId,
            description,
            document_path: documentPath,
            status: 'Pending'
        });
        
        res.render('claim-form', {
            title: 'File a Claim',
            user: req.session.user,
            success: 'Claim filed successfully! Our team will review it shortly.',
            error: null
        });
        
    } catch (error) {
        console.error('Claim error:', error);
        res.render('claim-form', {
            title: 'File a Claim',
            user: req.session.user,
            error: 'Error filing claim. Please try again.',
            success: null
        });
    }
};

// View all claims
exports.viewClaims = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        const userId = req.session.user.id;
        const allClaims = await Claim.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });
        
        res.render('claims', {
            title: 'My Claims',
            user: req.session.user,
            claims: allClaims || [],
            error: null,
            success: null
        });
        
    } catch (error) {
        console.error(error);
        res.render('claims', {
            title: 'My Claims',
            user: req.session.user,
            claims: [],
            error: 'Error loading claims. Please try again.',
            success: null
        });
    }
};