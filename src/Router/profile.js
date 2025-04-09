const express= require("express");
const profileRouter=express.Router();
 
const User=require("../model/user");

 
const {userAuth}= require("../middlewares/auth"); 
const {validateEditData}=require("../util/validator");


profileRouter.get("/profile/view",userAuth, async(req,res)=>{

    try{
    const user=req.User;
   
    res.send(user);
  }
  catch(err)
    {
      res.status(401).send("error in profile " + err.message);
    }
  });


  profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
      if(!validateEditData(req))
        {
          throw new Error("data note updated");
        }
        const olddata=req.User;
    
        Object.keys(req.body).forEach((key)=>
        (//insert the data in the olddata object
          olddata[key]=req.body[key]
        ))

        olddata.save();//save in database
        console.log(olddata);
        res.json({message: `${olddata.firstName},data updated successfully`,data: olddata,});
    }
    catch(err)
    {
      res.status(401).send("error in profile " + err.message);
    }
  });


  profileRouter.patch("/profile/forgotPassword",userAuth,async(req,res)=>{

    try{
      const newPassword=req.body;

      const user=req.User;
      Object.keys(req.body).forEach((key)=>
        (//insert the data in the olddata object
          user[key]=req.body[key]
        ));

        user.save();//save in database
        res.send("password updated successfully");

    }
    catch(err)
    {
      res.status(401).send("Not Update" + err.message);
    }
  })
  
  module.exports=profileRouter;  //exporting the profile router