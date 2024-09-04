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


window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem('token')

    axios.get("http://localhost:3000/expense/get-expense", { headers: { "Authorization": token } })
        .then(response => {
            console.log(response.data.allExpense)
            for (let i = 0; i < response.data.allExpense.length; i++) {
                displayExpenseOnScreen(response.data.allExpense[i])
            }
        })
        .catch(err => {
            console.log(err)
        })




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
            })
            .catch(err => {
                console.log(err)
            })
    })



}