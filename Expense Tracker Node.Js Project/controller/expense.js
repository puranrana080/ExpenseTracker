const Expense = require('../model/expense')
const path = require('path')
const User = require('../model/user')
const sequelize = require('../util/user')

exports.getExpenseFrom = (req, res, next) => {
    res.sendFile(path.join(__dirname, "../public/add_expense.html"))
}


exports.postAddExpense = async (req, res, next) => {
    const t = await sequelize.transaction()
    try {
        if (req.body.amount == undefined || req.body.amount === 0) {
            return res.status(400).json({ message: "Parameter missing" })
        }


        const expense = await Expense.create({
            amount: req.body.amount,
            description: req.body.description,
            category: req.body.category,
            userId: req.user.id
        }, { transaction: t })

        const user = await User.findByPk(req.user.id, { transaction: t })
        user.total_cost += parseFloat(req.body.amount)

        await user.save({ transaction: t })

        await t.commit()

        console.log(expense)
        res.status(200).json({
            expenseData: expense,
            message: "Expense added in db"
        })

    }
    catch (error) {

        await t.rollback()
        console.log(error)
        res.status(500).json({
            error: "Failed to add expense and update total user"
        })
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
    const t = await sequelize.transaction()
    try {
        const expenseId = req.params.Id

        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } })

        const total_cost = Number(req.user.total_cost) - Number(expense.amount)
        await Expense.destroy({
            where: { id: expenseId, userId: req.user.id }
        }, { transaction: t })

        await User.update({ total_cost: total_cost }, { where: { id: req.user.id }, transaction: t })

        await t.commit()
        res.status(200).json({
            message: "Expense deleted form db"
        })
    }
    catch (error) {
        await t.rollback()
        console.log(error)
        res.status(500).json({ message: "failed to delete" })
    }

}