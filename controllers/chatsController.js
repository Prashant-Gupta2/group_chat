const Chat = require('../models/chats');
const Signup = require('../models/signup');

const addChats = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        message: 'Please write something!'
      });
    }

    // logged-in user
    const user = await Signup.findByPk(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found!'
      });
    }
     const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    const response = await Chat.create({
      message: message,
      timestamp:time,
      userId: user.userId
    });

    return res.status(201).json({
      message: 'Message added!',
      chat: response
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: 'Failed to add message!'
    });
  }
};
const getChats = async (req, res) => {

  try {

    const response = await Chat.findAll({
      include: [
        {
          model: Signup,
          attributes: ['userId', 'name']
        }
      ]
    });

    return res.status(200).json({
      message: 'all messages',
      data: response,
      userId: req.user.userId
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: 'internal server error'
    });

  }
};

module.exports = { addChats ,getChats};