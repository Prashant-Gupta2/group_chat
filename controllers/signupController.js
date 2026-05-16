const bcrypt = require('bcrypt');
const Signup = require('../models/signup');

const createAccount = async (req, res) => {
  try {

    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: 'All fields are required!'
      });
    }

    const isUserExist = await Signup.findOne({
      where: { email }
    });

    if (isUserExist) {
      return res.status(409).json({
        message: 'User already exists!'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Signup.create({
      name,
      email,
      phone,
      password: hashedPassword
    });

    return res.status(201).json({
      message: 'Account created successfully!'
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = { createAccount };