const { DataTypes } = require("sequelize");
const db = require("../config/dbConnection");

const ArchivedChat = db.define("ArchivedChat", {
  chat_id: {
    type: DataTypes.INTEGER,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mediaUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mediaType: {
    type: DataTypes.ENUM("image", "video", "audio", "document"),
    allowNull: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roomName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  archivedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = ArchivedChat;