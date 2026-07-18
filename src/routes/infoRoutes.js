const express = require('express');
const router = express.Router();
const infoController = require('../controllers/infoController');

router.get('/info', infoController.index);
router.get('/info/bmi', infoController.bmi);
router.get('/info/risk-score', infoController.riskScore);
router.get('/info/premium', infoController.premium);
router.get('/info/health-score', infoController.healthScore);
router.get('/info/glossary', infoController.glossary);

module.exports = router;