const User = require('../model/user')
const Expense = require('../model/expense')
const sequelize = require('../util/user')




exports.getUserLeaderBoard = async (req, res) => {
    try {

        const leaderboardofusers = await User.findAll({
            attributes: ['id', 'userName', 'total_cost'],
            // group: ['users.id'],
            order: [['total_cost', 'DESC']]
        })

        console.log(leaderboardofusers)
        res.status(200).json(leaderboardofusers)
    }
    catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}