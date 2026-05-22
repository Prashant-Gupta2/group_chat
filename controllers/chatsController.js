const Chat = require("../models/chats");
const Signup = require("../models/signup");


const addChats = async (req, res) => {

  try {

    const { message,  mediaUrl,  mediaType } = req.body;

    if (!message?.trim() && !mediaUrl) {
      return res.status(400).json({
        message: "Message or media required!"
      });
    }

    // LOGGED IN USER
    const user = await Signup.findByPk(req.user.userId);

    if (!user) {

      return res.status(404).json({
        message: "User not found!"
      });
    }

    // SAVE CHAT
    const response = await Chat.create({
      message: message || "",
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
      userId: user.userId
    });
    return res.status(201).json({
      message: "Message added!",
      chat: response
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Failed to add message!"
    });
  }
};

const getChats = async (req, res) => {
  try {
    const response = await Chat.findAll({
      include: [
        {
          model: Signup,
          attributes: ["userId", "name"]
        }
      ],
      order: [["createdAt", "ASC"]]
    });

    return res.status(200).json({
      message: "All messages",
      data: response,
      userId: req.user.userId
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

module.exports = { addChats,getChats};