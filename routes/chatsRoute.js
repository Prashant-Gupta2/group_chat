const express = require('express');
const router = express.Router();

const chatsController = require('../controllers/chatsController');
const authmiddleware = require('../middleware/authtenication');

router.post('/chat-add',authmiddleware,chatsController.addChats);
router.get("/get-chats",authmiddleware,chatsController.getChats);

module.exports = router;