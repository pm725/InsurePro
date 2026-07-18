const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

router.get('/community/tips', communityController.tips);
router.get('/community/tip/new', communityController.newTipForm);
router.post('/community/tip', communityController.createTip);
router.get('/community/tip/:id', communityController.tipDetail);
router.post('/community/tip/:id/upvote', communityController.upvote);
router.post('/community/tip/:id/comment', communityController.addComment);

module.exports = router;