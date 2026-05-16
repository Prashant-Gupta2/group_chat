require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/dbConnection');

const Signup = require('./models/signup');
const Signin = require('./models/signin');
const Chat = require('./models/chats');
const signupRoute = require('./routes/signupRoute');
const signinRoute = require('./routes/signinRoute');
const chatsRoute = require('./routes/chatsRoute');

//middlewere
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended:true}))

// one to many relation
Signup.hasMany(Chat,{foreignKey:'userId'})
Chat.belongsTo(Signup,{foreignKey:'userId'})

app.get('/chat-app',(req,res)=>{
 res.send('this is group chat app demo')
})
app.use("/chat-app",signupRoute);
app.use("/chat-app",signinRoute);
app.use("/chat-app",chatsRoute);

db.sync({alter:true})
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server is running!");
    });
  })
  .catch(err => console.log(err));