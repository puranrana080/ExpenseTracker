const express = require('express')
const path = require('path')
const sequelize = require("./util/user")
const User = require('./model/user')
const Expense = require('./model/expense')
const Order = require('./model/order')
const FilesDownloaded=require('./model/filesdownloaded')
const app = express()
const cors = require('cors')
const ForgotPasswordRequests=require('./model/forgotpasswordrequests')

const Razorpay = require("razorpay")

require('dotenv').config()


const expenseRoutes = require('./routes/expense')
const userRoutes = require('./routes/user')
const purchaseRoutes = require('./routes/purchase')
const premiumRoutes=require('./routes/premium')
const passwordRoutes=require('./routes/password')
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use(userRoutes)
app.use(expenseRoutes)
app.use(purchaseRoutes)
app.use(premiumRoutes)
app.use(passwordRoutes)



User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPasswordRequests)
ForgotPasswordRequests.belongsTo(User)

User.hasMany(FilesDownloaded)
FilesDownloaded.belongsTo(User)




 sequelize.sync()
// sequelize.sync({force:true})

    .then(() => {
        app.listen(3000, () => {
            console.log("Listeneing to port 3000")
        })

    })
    .catch(err => {
        console.log(err)
    })
