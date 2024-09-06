const express = require('express')
const router = express.Router()

const userauthentication=require('../middleware/auth')
const userController = require('../controller/user')
const purchaseController=require('../controller/purchase')



router.get('/', userController.getRegisterForm)

router.post('/user/register', userController.postRegisterForm)

router.post("/user/login", userController.postLoginForm)

router.get('/user/ispremium',userauthentication.authenticate,purchaseController.checkUserPremium)


module.exports = router