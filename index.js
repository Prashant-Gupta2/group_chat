require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');

const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);

const db = require('./config/dbConnection');

const Signup = require('./models/signup');
const Signin = require('./models/signin');
const Chat = require('./models/chats');

const signupRoute = require('./routes/signupRoute');
const signinRoute = require('./routes/signinRoute');
const chatsRoute = require('./routes/chatsRoute');

const jwt = require('jsonwebtoken');

const io = new Server(server, {

  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }

});

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

Signup.hasMany(Chat, {foreignKey: 'userId',onDelete: 'CASCADE'});

Chat.belongsTo(Signup, {foreignKey: 'userId'});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'signin.html'));
});

app.use('/chat-app', signupRoute);

app.use('/chat-app', signinRoute);

app.use('/chat-app', chatsRoute);


io.on('connection', (socket) => {

  console.log(`User Connected: ${socket.id}`);

  // RECEIVE MESSAGE
  socket.on('send_message', async (data) => {
    try {
      // TOKEN CHECK
      if (!data.token) {
        return socket.emit('error_message', {
          message: 'Unauthorized user'
        });
      }

      // VERIFY TOKEN
      const decoded = jwt.verify(
        data.token,
        process.env.JWT_SECRET
      );

      // FIND USER
      const user = await Signup.findByPk(
        decoded.userId
      );

      if (!user) {
        return socket.emit('error_message', {
          message: 'User not found'
        });

      }
      // SAVE MESSAGE
      const savedMessage = await Chat.create({
        message: data.message,
        userId: user.userId
      });

      const fullMessage = await Chat.findByPk(
        savedMessage.id,
        {
          include: [
            {
              model: Signup,
              attributes: ['name']
            }
          ]
        }
      );

      // SEND TO ALL USERS
     io.emit('receive_message', {
    id: savedMessage.id,
    message: savedMessage.message,
    userId: savedMessage.userId,
    name: user.name,
    createdAt: savedMessage.createdAt
  });
    }
     catch (err) {

      console.log(err);

      socket.emit('error_message', {
        message: 'Failed to send message'
      });
    }
  });
  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

db.sync()
  .then(() => {
    const PORT = process.env.PORT || 4000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}` );
    });
  })
  .catch((err) => {
    console.log('Database connection failed:', err);
  });