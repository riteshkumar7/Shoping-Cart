const mongoose=require("mongoose");
const bcrypt=require("bcrypt")
const data=new mongoose.Schema({

    username:{type:String},
    mobile:{type:Number},
    email:{type:String},
    password:{type:String}

});
data.pre('save',async function(next){
    if(this.isModified("password"))
    {
        this.password=await bcrypt.hash(this.password,12)
    }
    next();
})
const Data=new mongoose.model("Data",data);
module.exports=Data;