const express=require("express")
const Data=require("../Model/data")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const route=express.Router();
require("../DB/cont");

const fun=(req,res,next)=>
{
    console.log("welcome...");
    next();
}

route.get("/",(req,res)=>{
    res.send("Home Page");
})
route.post("/saveData",fun,async (req,res)=>{
    try{
        const {username,mobile,email,password}=req.body;
        let employee=new Data({username,mobile,email,password})
        await employee.save();
        res.send("employee Joind")
    }
    catch(e){
        console.log(e)
    }
})

route.post("/login",async(req,res)=>{
    try{
        const{username,password}=req.body;
        const user=await Data.findOne({username});
        if((await bcrypt.compare(password, user.password))){
            const token=jwt.sign(
                {user_id:user._id,username},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"2h",
                }
            )
            user.token=token;
            res.send(user);
        }
        else{
            res.send("Invalid");
        }
    }
    catch(err){
        console.log(err);
    }
});

route.get("/getInfo",async(req,res)=>{
    try{
        let data=await Data.find();
        res.send(data);
    }
    catch(e){
        console.log(e);
    }
})


route.put("/editData/:username",async(req,res)=>{
    try{
        let{username}=req.params;
        await Data.findOneAndUpdate({username:username},req.body,{new:true})
        res.send("updated...")
    }
    catch(e){
        console.log(e)
    }
})


module.exports=route;