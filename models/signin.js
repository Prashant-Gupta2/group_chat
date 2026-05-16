const {DataTypes, DATE} = require('sequelize');
const db = require('../config/dbConnection');

const Signin = db.define('Signin',{
 email:{
 type:DataTypes.STRING,
 allowNull:false
 },
 phone:{
 type:DataTypes.STRING,
 allowNull:false
 },
 password:{
 type:DataTypes.STRING,
 allowNull:false
 }
});

module.exports = Signin;