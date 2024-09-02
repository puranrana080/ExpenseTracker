const express = require('express')
const path = require('path')
const sequelize = require("./util/user")
const bcrypt=require('bcrypt')
const User = require("./model/user")
const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

app.post('/user/register', async (req, res, next) => {
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
            console.log(err)
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


app.post("/user/login", async (req, res, next) => {
    try {
        console.log(req.body)
        const userAvailable = await User.findOne({
            where: { userEmail: req.body.email }
        })
        if (userAvailable) {

            const isPasswordValid= await bcrypt.compare(req.body.password,userAvailable.password);

            if(isPasswordValid){
                console.log("login successful")
                res.status(200).json({ message: "User Login Successful" })

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





sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Listeneing to port 3000")
        })

    })
    .catch(err => {
        console.log(err)
    })
