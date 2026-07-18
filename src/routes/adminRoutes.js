const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin auth middleware - applies to all /admin/* routes
router.use(adminController.isAdmin);

// Dashboard
router.get('/admin/dashboard', adminController.dashboard);

// User Management
router.get('/admin/users', adminController.users);
router.get('/admin/user/:id', adminController.userDetails);
router.delete('/admin/user/:id', adminController.deleteUser);

// Claim Management
router.get('/admin/claims', adminController.claims);
router.post('/admin/claim/:id', adminController.updateClaim);

// Quiz Management
router.get('/admin/quizzes', adminController.quizzes);

module.exports = router;