const express=require("express");
const {userAuth}=require("../middlewares/auth");
const connectionRequest=require("../model/connectionRequest"); 
const User=require("../model/user");
const connectionRouter=express.Router();

connectionRouter.post("/connection/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const fromUserId=req.User._id;
      
        const allowedStatus=["interested","ignored"];
     
        const isValidUser=User.findById(toUserId);
        if(!isValidUser)
        {
            return res.status(404).json({message:"user not found"});
        }

        if(toUserId==fromUserId)
        {
            return res.status(404).json({message:"connection request not send"})
        }

        if(!allowedStatus.includes(status))
        {
           return res.status(401).json({message:"status not allowed"});
        }

        const existingConnectionRequets=await connectionRequest.findOne({
            $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}],
        })
        
        if(existingConnectionRequets)
        {
            return  res.status(401).json({message:"connection request already sent"});
        }

        const connectionRequestData=new connectionRequest({
            fromUserId,
            toUserId,
            status,
        })
        await connectionRequestData.save();

        res.status(200).json({message:"connection request sent successfully"});
        
       }
         catch(err)
          {
                res.status(401).send("error in connection " + err.message);
          }
})

module.exports=connectionRouter;