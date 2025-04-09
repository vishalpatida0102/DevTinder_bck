

const mongoose=require("mongoose");

const connectDB=async()=>{
    
    await mongoose.connect("mongodb+srv://vishalpatidarji2000:XrJQBD8NIv4qYu1e@devtinder.hoxxce4.mongodb.net/devData");
 
};

module.exports=connectDB;
