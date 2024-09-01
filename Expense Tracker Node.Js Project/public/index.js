function registeringUser(event) {
    event.preventDefault()
    const newUser = {
        userName: event.target.name.value,
        userEmail: event.target.email.value,
        password: event.target.password.value
    }

    axios.post("http://localhost:3000/user/register", newUser)
        .then(response => {
            console.log("User Added", response.data.newUser)
        })
        .catch(err => {
            const p = document.querySelector('p')
            const exist = document.createElement('p')
            exist.appendChild(document.createTextNode("User Already exist"))
            p.appendChild(exist)

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
            const p = document.querySelector('#message')
            p.innerHTML = ""
        })
        .catch(err => {
            const p = document.querySelector('#message')
            p.innerHTML = "User Not found"

            console.log("Error in server", err)
        })

}