const express = require('express');
const router = express.Router();
const claimController = require('../controllers/claimController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'claim-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
        }
    }
});

// Routes
router.get('/claim/file', claimController.showClaimForm);
router.post('/claim/file', (req, res, next) => {
    upload.single('document')(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading
            console.error('Multer error:', err);
            return res.render('claim-form', {
                title: 'File a Claim',
                user: req.session.user,
                error: err.message || 'File upload error. Please try again.',
                success: null
            });
        } else if (err) {
            // An unknown error occurred
            console.error('Upload error:', err);
            return res.render('claim-form', {
                title: 'File a Claim',
                user: req.session.user,
                error: 'Error uploading file. Please try again.',
                success: null
            });
        }
        // Everything went fine
        claimController.fileClaim(req, res);
    });
});
router.get('/claims', claimController.viewClaims);

module.exports = router;