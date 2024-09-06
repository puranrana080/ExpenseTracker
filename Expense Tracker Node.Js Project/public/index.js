

function registeringUser(event) {
    event.preventDefault()
    const newUser = {
        userName: event.target.name.value,
        userEmail: event.target.email.value,
        password: event.target.password.value
    }

    axios.post("http://localhost:3000/user/register", newUser)
        .then(response => {
            console.log("User Added", response.data.message)
            event.target.reset()
        })
        .catch(err => {
            const p = document.querySelector('#message')
            p.innerHTML = err.message

            console.log("something is wrong", err)
        })
}


function loginUser(event) {
    event.preventDefault()
    const loginData = {
        email: event.target.email.value,
        password: event.target.password.value
    }
    axios.post("http://localhost:3000/user/login", loginData)
        .then(response => {
            alert("Login successful")
            console.log("User Logged in", response.data.message)

            localStorage.setItem('token', response.data.token)
            window.location.href = "/expense"


        })
        .catch(err => {
            const p = document.querySelector('#message')
            p.innerHTML = "User Not found"

            console.log("Error in server", err)
        })

}



function handleAddExpense(event) {
    event.preventDefault()

    const expense = {
        amount: event.target.amount.value,
        description: event.target.description.value,
        category: event.target.category.value
    }


    const token = localStorage.getItem('token')
    axios.post("http://localhost:3000/expense/add-expense", expense, { headers: { "Authorization": token } })
        .then(response => {
            displayExpenseOnScreen(response.data.expenseData)
            event.target.reset()
        })

        .catch(err => {
            console.log(err)
        })


}

async function updatePremiumStatus() {
    try {
        const token = localStorage.getItem('token')

        const userResponse = await axios.get('http://localhost:3000/user/ispremium', { headers: { "Authorization": token } })
        if (userResponse.data.isPremiumUser) {
            const premiumBtn = document.getElementById('rzp-button');
            premiumBtn.textContent = 'Premium User';
            const puser = document.createElement('p')
            puser.textContent = "You are Premium user"

            premiumBtn.replaceWith(puser)

            showLeaderBoard()



        }
    }
    catch (error) {
        console.error("Error updating premium", error)
    }

}


function showLeaderBoard() {
    const inputElement = document.createElement('input')

    inputElement.type = 'button'
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async () => {
        try {
            const token = localStorage.getItem('token')
            const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showleaderboard', { headers: { "Authorization": token } })
            console.log(userLeaderBoardArray)

            var leaderBoardEle = document.getElementById('leaderboard')
            leaderBoardEle.innerHTML = '<h1>Leaderboard</h1>'

            userLeaderBoardArray.data.forEach((userDetails) => {
                leaderBoardEle.innerHTML += `<li> Name-${userDetails.userName}--Total Expense ${userDetails.total_cost}     </li>`

            })
        }
        catch (err) {
            console.error("Error fetching leaderboard", err)
        }
    }
    document.getElementById('message').appendChild(inputElement)
}


window.addEventListener("DOMContentLoaded", async () => {

    await updatePremiumStatus()
    const token = localStorage.getItem('token')
    try {
        const response = await axios.get("http://localhost:3000/expense/get-expense", { headers: { "Authorization": token } })

        console.log(response.data.allExpense)
        for (let i = 0; i < response.data.allExpense.length; i++) {
            displayExpenseOnScreen(response.data.allExpense[i])
        }
    }
    catch (err) {
        console.log("Error fetching data", err)
    }




})

function displayExpenseOnScreen(expense) {
    const list = document.querySelector('ul')


    const newList = document.createElement('li')
    newList.appendChild(document.createTextNode(`${expense.amount}  ${expense.description}  ${expense.category}  `))
    list.appendChild(newList)

    const delBtn = document.createElement('button')
    delBtn.appendChild(document.createTextNode("Delete Expense"))
    newList.appendChild(delBtn)



    delBtn.addEventListener("click", () => {
        const token = localStorage.getItem('token')

        axios.delete(`http://localhost:3000/expense/delete-expense/${expense.id}`, { headers: { "Authorization": token } })
            .then(result => {
                console.log("Expense Deleted")
                list.removeChild(newList)
                showLeaderBoard()
            })
            .catch(err => {
                console.log(err)
            })
    })



}

document.getElementById('rzp-button').onclick = async function (e) {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: { "Authorization": token } })

    console.log(">>>>>>>>>>>>", response)

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {

            await axios.post("http://localhost:3000/purchase/updatetransactionstatus",
                {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                },
                { headers: { "Authorization": token } })

            alert("You are premium User Now")

            location.reload()

        }
    }
    const rzp1 = new Razorpay(options)

    rzp1.open()

    rzp1.on('payment-failed', async function (response) {

        console.log("########")
        console.log("Payment Failed", response)

        await axios.post('http://localhost:3000/purchase/failedtransactionstatus',
            {
                order_id: options.order_id,
            }, { headers: { "Authorization": token } }
        )

        alert("Payment Failed! Something went wrong")
    })

}