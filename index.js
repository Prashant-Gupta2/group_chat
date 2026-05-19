require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');

const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const socketIO = require('./socket_io/socket')
const io = socketIO(server);

const db = require('./config/dbConnection');

const Signup = require('./models/signup');
const Signin = require('./models/signin');
const Chat = require('./models/chats');

const signupRoute = require('./routes/signupRoute');
const signinRoute = require('./routes/signinRoute');
const chatsRoute = require('./routes/chatsRoute');

const jwt = require('jsonwebtoken');


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

 io.use((socket, next) => {
  try {

    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = decoded;

    next();

  } catch (err) {
    console.log(err);
    next(new Error("Invalid token"));
  }
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