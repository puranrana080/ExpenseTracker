const express=require('express')
const path=require('path')


const  app=express()

app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"))
})

app.post('/user/register',(req,res,next)=>{
    console.log(req.body)
    res.json({message:"all good"})
})

app.listen(3000,()=>{
    console.log("listening to port 3000")
})