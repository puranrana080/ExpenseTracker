

function resetPassword(event){
    event.preventDefault()
    const email=event.target.email.value

    axios.post("http://localhost:3000/password/forgotpassword",{email:email})
    .then((result)=>{
        console.log(result)
    })
    .catch(err=>{
        console.log(err)
    })
}