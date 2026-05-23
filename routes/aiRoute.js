const express = require('express');
const router = express.Router();
const AiController = require('../controllers/aiController');

router.post("/predict", AiController.predictText);

// router.post("/smart-reply", AiController.smartReplies);

module.exports = router;