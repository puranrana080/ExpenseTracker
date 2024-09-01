function registeringUser(event){
    event.preventDefault()
    const newUser={
        userName:event.target.name.value,
        userEmail:event.target.email.value,
        password:event.target.password.value
    }

    axios.post("http://localhost:3000/user/register",newUser)
    .then(response=>{
        console.log("User Added",response.data.newUser)
    })
    .catch(err=>{
        const p=document.querySelector('p')
        const exist=document.createElement('p')
        exist.appendChild(document.createTextNode("User Already exist"))
        p.appendChild(exist)
    
        console.log("something is wrong",err)
    })
}