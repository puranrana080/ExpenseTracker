function registeringUser(event){
    event.preventDefault()
    const newUser={
        userName:event.target.name.value,
        userEmail:event.target.email.value,
        password:event.target.password.value
    }

    axios.post("http://localhost:3000/user/register",newUser)
    .then(response=>{
        console.log("User Added")
    })
    .catch(err=>{
        console.log("something is wrong",err)
    })
}