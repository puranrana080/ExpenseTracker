const Expense = require('../model/expense')
const path = require('path')

exports.getExpenseFrom = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/add_expense.html"))
}


exports.postAddExpense = async (req, res, next) => {
    try {

        const expense = await Expense.create({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category,
            userId: req.user.id
        })

        console.log(expense)
        res.status(200).json({
            expenseData: expense,
            message: "Expense added in db"
        })

    }
    catch (error) {
        console.log(error)
    }

}

exports.getExpense = async (req, res, next) => {
    try {
        const getAllExpense = await Expense.findAll({ where: { userId: req.user.id } })
        res.status(200).json({
            allExpense: getAllExpense
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }


}

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.Id
        await Expense.destroy({
            where: { id: expenseId, userId: req.user.id }
        })
        res.status(200).json({
            message: "Expense deleted form db"
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "failed to delete" })
    }

}