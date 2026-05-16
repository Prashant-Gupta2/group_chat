require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/dbConnection');

const Signup = require('./models/signup');
const Signin = require('./models/signin');
const signupRoute = require('./routes/signupRoute');
const signinRoute = require('./routes/signinRoute')

//middlewere
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({extended:true}))

// one to many relation

app.get('/chat-app',(req,res)=>{
 res.send('this is group chat app demo')
})
app.use("/chat-app",signupRoute);
app.use("/chat-app",signinRoute);

db.sync()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log("Server is running!");
    });
  })
  .catch(err => console.log(err));