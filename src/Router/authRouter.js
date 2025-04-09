const express= require("express");
const authRouter=express.Router();
const bcrypt = require("bcrypt");
const User=require("../model/user");
const cookieParser=require("cookie-parser");

const validator=require("validator");
const {userAuth}= require("../middlewares/auth");
const {validateData}=require("../util/validator");
 
// console.log("validator",validator);
    authRouter.post("/signup", async (req,res)=>{
  
    
      
      try{
          const {firstName,lastName,password,gmail,skil,age}=req.body;
        validateData(req); //this function is used to validate the data
        
        const email=  await User.findOne({gmail:gmail}); // await laga na jaruri he kyo ki find wala 
        //function jab tak ans nahi de deta tab tak aage nahi badta
        // agar email nahi mila to null return karega
        // agar email mila to true return karega
         if(email)
          { 
                throw new Error("email already exist");
              
          }
        const encreptedPassword=await bcrypt.hash(password,10);
       
        const user= new User({
          password:encreptedPassword,
            firstName,
            lastName,
            skil, 
            age,
            gmail,

        })
        await user.save();
        res.send("data inserted");
      }catch(err)
      {
        
          res.status(400).send("Error inserting data: " + err.message);
      }
      


    });


    authRouter.post("/login", async(req,res)=>
    {
      const {gmail,password}=req.body;

       
      try{
        if(!validator.isEmail(gmail))
          {
              throw new Error("invalid email format " + gmail);
          }
        const user=await User.findOne({gmail:gmail});
        if(!user)
        {
          throw new Error("invalid credentials email");
        }
        else
        {
          const isMatch=await user.validPassword(password);
          if(!isMatch)
          {
            throw new Error("invalid credentials password");
          }
          else
          {
            const token= await user.jwtGet();
            res.cookie("token",token,{
              expires:new Date(Date.now() + 3*24*60*60*1000), //3 days

            });
            

            res.send("login successfully")
          }

         
        }
      }
      catch(err)
      {
        res.status(401).send("error in login:- " + err.message);
      }
    });

    authRouter.get("/logout" ,async(req,res)=>
        // it is my solution to logout
    {
    //     try{
    //         const cookie=req.cookies;
    //         const {token}=cookie;
    //         res.clearCookie("token");
    //         res.send("logout successfully");
    //     }
    //     catch(err)
    //     {
    //         res.status(401).send("error in logout " + err.message);
    //     }

    // this solutin it given by sir

    req.cookie("token",null,{ expires:new Date(Date.now()),});
    });



   

      module.exports=authRouter;
  