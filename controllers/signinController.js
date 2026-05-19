const bcrypt = require('bcrypt');
const Signup = require('../models/signup');
const jwt = require('jsonwebtoken');

const LoginAccount = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        message: 'Email and password are required'
      });

    }

    const user = await Signup.findOne({
      where: { email }
    });

    if (!user) {

      return res.status(404).json({
        message: 'User not found'
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        message: 'Invalid password'
      });

    }

    const token = jwt.sign(
      {
        userId: user.userId,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({

      message: 'Login successful',

      token,

      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone
      }

    });

  }
  
  catch (err) {

    console.log(err);

    return res.status(500).json({
      message: 'Internal server error'
    });

  }

};

module.exports = { LoginAccount };