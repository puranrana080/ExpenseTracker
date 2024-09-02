const express=require('express')
const router=express.Router()
const Expense=require('../model/expense')
const path=require('path')


router.get('/expense',(req,res,next)=>{
    res.sendFile(path.join(__dirname,"../public/add_expense.html"))
})

router.post('/expense/add-expense', async (req,res,next)=>{
    try{

        const expense=await Expense.create({
            amount:req.body.amount,
            description:req.body.description,
            category:req.body.category
        })

        console.log(expense)
        res.status(200).json({
            expenseData:expense,
            message:"Expense added in db"
        })

    }
    catch(error){
        console.log(error)
    }

})


router.get('/expense/get-expense',async (req,res,next)=>{
    try{
        const getAllExpense=await Expense.findAll()
        res.status(200).json({
            allExpense:getAllExpense
        })

    }
    catch(error){
        console.log(error)
        res.status(500).json({ message: "Internal server error"})
    }


})

router.delete('/expense/delete-expense/:Id',async (req,res,next)=>{
   try{ 
const expenseId=req.params.Id
    await Expense.destroy({ 
        where:{id:expenseId}
    })
    res.status(200).json({
        message:"Expense deleted form db"
    })
}
catch(error){
    console.log(error)
    res.status(500).json({message:"failed to delete"})
}

})




module.exports=router