const express = require('express');
const router = express.Router();

const mediashareController = require('../controllers/mediashare');

router.post("/media-share",mediashareController.mediaShare);

module.exports = router;