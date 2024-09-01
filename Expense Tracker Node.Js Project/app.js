const express=require('express')
const path=require('path')
const sequelize=require("./util/user")
const User=require("./model/user")
const  app=express()

app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"))
})

app.post('/user/register',async (req,res,next)=>{
    try{
    console.log(req.body)

    const existingUser=await User.findOne({
        where:{
            userEmail : req.body.userEmail
        }
    })
    if(existingUser){
        return res.status(400).json({message:"User Already exist, Try with new Email"})
    }

    const user= await User.create({
        userName:req.body.userName,
        userEmail:req.body.userEmail,
        password:req.body.password
    })
    console.log(user)
    res.status(200).json({newUser:user})

    }
    catch(err){
        console.log("User not Created",err)
        res.status(500).json({ message: "Internal server error" });
    }
})





sequelize.sync()
.then(()=>{
    app.listen(3000,()=>{
        console.log("Listeneing to port 3000")
    })

})
.catch(err=>{
    console.log(err)
})
