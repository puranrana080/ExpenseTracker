const Sequelize=require('sequelize')
const sequelize=require('../util/user')


const User=sequelize.define('users',{
    userName:{
        type:Sequelize.STRING,
        allownull:false,

    },
    userEmail:{
        type:Sequelize.STRING,
        allownull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allownull:false
    }
})

module.exports=User