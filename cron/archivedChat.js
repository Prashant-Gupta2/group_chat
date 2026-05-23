const { CronJob } = require("cron");
const { Op } = require("sequelize");

const Chat = require("../models/Chat");
const ArchivedChat = require("../models/ArchivedChat");

const archiveChatsJob = new CronJob(
  "0 0 2 * * *",
  async () => {
    try {
      console.log("Starting archive job...");

      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const oldChats = await Chat.findAll({
        where: {
          createdAt: {
            [Op.lt]: oneDayAgo,
          },
        },
      });

      if (!oldChats.length) {
        console.log("No chats to archive");
        return;
      }

      const archiveData = oldChats.map((chat) => ({
        chat_id: chat.chat_id,
        message: chat.message,
        mediaUrl: chat.mediaUrl,
        mediaType: chat.mediaType,
        fileName: chat.fileName,
        fileSize: chat.fileSize,
        thumbnailUrl: chat.thumbnailUrl,
        roomName: chat.roomName,
        userId: chat.userId,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        archivedAt: new Date(),
      }));

      await ArchivedChat.bulkCreate(archiveData);

      const ids = oldChats.map((c) => c.chat_id);

      await Chat.destroy({
        where: {
          chat_id: ids,
        },
      });

      console.log(`${ids.length} chats archived`);
    } catch (err) {
      console.log(err);
    }
  },
  null,
  true
);

module.exports = archiveChatsJob;