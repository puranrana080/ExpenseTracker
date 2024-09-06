const User = require('../model/user')
const Expense = require('../model/expense')




exports.getUserLeaderBoard = async (req, res) => {
    try {

        const users = await User.findAll()
        const expenses = await Expense.findAll()
        console.log(expenses)
        const userAggregatedExpenses = {}

        expenses.forEach((expense) => {
            const expenseAmount = parseFloat(expense.amount)
            if (userAggregatedExpenses[expense.userId]) {
                userAggregatedExpenses[expense.userId] += expenseAmount
            }
            else {
                userAggregatedExpenses[expense.userId] = expenseAmount

            }
        })
        var userLeaderBoardDetails = []
        users.forEach((user) => {
            userLeaderBoardDetails.push({ name: user.userName, total_cost: userAggregatedExpenses[user.id] || 0 })

        })

        console.log(userLeaderBoardDetails)
        userLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost)
        res.status(200).json(userLeaderBoardDetails)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}