const express = require('express')
const path = require('path')
const sequelize = require("./util/user")
const User = require('./model/user')
const Expense = require('./model/expense')

const app = express()


const expenseRoutes = require('./routes/expense')
const userRoutes = require('./routes/user')

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.use(userRoutes)
app.use(expenseRoutes)



User.hasMany(Expense)
Expense.belongsTo(User)


sequelize.sync()

    .then(() => {
        app.listen(3000, () => {
            console.log("Listeneing to port 3000")
        })

    })
    .catch(err => {
        console.log(err)
    })
