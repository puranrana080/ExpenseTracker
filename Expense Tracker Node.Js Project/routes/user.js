const express=require('express')
const router=express.Router()
const path=require('path')
const bcrypt=require('bcrypt')
const User=require('../model/user')

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})



router.post('/user/register', async (req, res, next) => {
    try {
console.log(req.body)
        const {userName,userEmail,password}=req.body
        

        const existingUser = await User.findOne({
            where: {
                userEmail: userEmail
            }
            
        })
        console.log(existingUser)
        if (existingUser) {
            return res.status(400).json({ message: "User Already exist, Try with new Email" })
        }
        const saltRounds=10;

        bcrypt.hash(password,saltRounds,async(err,hash)=>{
            if(err){
                console.log("err:",err)
            }
            await User.create({userName,
                userEmail,
                password:hash})
            res.status(201).json({ message: "Successfully created new user" })
        })

    }
    catch (err) {
        console.log("User not Created", err)
        res.status(500).json({ message: "Internal server error" });
    }
})


router.post("/user/login", async (req, res, next) => {
    try {
        console.log(req.body)
        const userAvailable = await User.findOne({
            where: { userEmail: req.body.email }
        })
        if (userAvailable) {

            const isPasswordValid= await bcrypt.compare(req.body.password,userAvailable.password);

            if(isPasswordValid){
                console.log("login successful")
                res.status(200).json({message:"logged in"})

            }

            // if (req.body.password === userAvailable.password) {
            //     console.log("login successful")
                
            // }
            else {
                console.log("Password Wrong")
                res.status(401).json({ message: "User not authorized" })
            }
        }
        else {
            console.log("not logged in")
            res.status(404).json({ message: "User not found" })
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal error" })
    }
})



module.exports=router