const {DataTypes} = require('sequelize')

const db = require('../config/dbConnection');

const Signup = db.define('Signup',{
 userId:{
  type:DataTypes.INTEGER,
  primaryKey:true,
  autoIncrement:true
 },
 name:{
   type:DataTypes.STRING,
   allowNull:false
 },
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

module.exports = Signup;