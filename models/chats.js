const { DataTypes } = require('sequelize');

const db = require('../config/dbConnection');

const Chat = db.define('Chat', {

  chat_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  chat_msg: {
    type: DataTypes.STRING,
    allowNull: false
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  timestamps: true
});

module.exports = Chat;