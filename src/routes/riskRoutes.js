const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');

router.get('/risk/calculate', riskController.showRiskForm);
router.post('/risk/calculate', riskController.calculateRisk);
router.get('/dashboard', riskController.showDashboard);

module.exports = router;