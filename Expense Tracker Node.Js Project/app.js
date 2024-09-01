const express = require('express')
const path = require('path')
const sequelize = require("./util/user")
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

        const existingUser = await User.findOne({
            where: {
                userEmail: req.body.userEmail
            }
        })
        if (existingUser) {
            return res.status(400).json({ message: "User Already exist, Try with new Email" })
        }

        const user = await User.create({
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            password: req.body.password
        })
        console.log(user)
        res.status(200).json({ newUser: user })

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

            if (req.body.password === userAvailable.password) {
                console.log("login successful")
                res.status(200).json({ message: "User Login Successful" })
            }
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
