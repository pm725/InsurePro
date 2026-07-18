const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/quiz/start', quizController.start);
router.get('/quiz/question/:step', quizController.question);
router.post('/quiz/answer', quizController.answer);
router.get('/quiz/result', quizController.result);

module.exports = router;