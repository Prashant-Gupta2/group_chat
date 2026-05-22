const { DataTypes } = require("sequelize");

const db = require("../config/dbConnection");

const Chat = db.define("Chat", {

  chat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // TEXT MESSAGE
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // IMAGE / VIDEO / AUDIO / FILE URL
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // image | video | audio | document
  mediaType: {
    type: DataTypes.ENUM(
      "image",
      "video",
      "audio",
      "document"
    ),
    allowNull: true
  },

  // OPTIONAL FILE NAME
  fileName: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // OPTIONAL FILE SIZE
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // OPTIONAL THUMBNAIL
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },

  // ROOM NAME
  roomName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // SENDER
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  timestamps: true
});

module.exports = Chat;