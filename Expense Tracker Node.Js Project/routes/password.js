const express=require('express')
const router=express.Router()

const passwordController=require('../controller/password')

router.post('/password/forgotpassword',passwordController.resetPassword)

module.exports=router