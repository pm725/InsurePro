const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// All admin routes require admin auth (middleware)
router.use(adminController.isAdmin);

router.get('/admin/dashboard', adminController.dashboard);
router.get('/admin/users', adminController.users);
router.get('/admin/claims', adminController.claims);
router.post('/admin/claim/:id', adminController.updateClaim);
router.delete('/admin/user/:id', adminController.deleteUser);

module.exports = router;