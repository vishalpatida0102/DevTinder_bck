const express=require("express");
const userRouter=express.Router();
const {userAuth}= require("../middlewares/auth");
const User=require("../model/user");
const connectionRequestSchema=require("../model/connectionRequest");


userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{

        const receivedId=req.User._id;

        const connectionRequest=await connectionRequestSchema.find({toUserId:receivedId,status:"interested"}).populate("fromUserId","firstName lastName");
        
        if(!connectionRequest)
        {
            return  res.send("no connection request found");
        }

        res.status(200).json({message:"connection request found",data:connectionRequest});
    }
    catch(err)
    {
        res.status(401).send("error in connection request " + err.message);
    }
})



userRouter.get("/user/request/sent",userAuth,async(req,res)=>{
    try{
        const loginUserid=req.User._id;


        const connectionRequests=await connectionRequestSchema.find({
            $or:[{formUserId:loginUserid,status:"accepted"},
                {toUserId:loginUserid,status:"accepted"}],
        }).populate("fromUserId","firstName lastName")
        .populate("toUserId","firstName lastName");



        if(!connectionRequests)
        {
            return res.send("no connection request found");
        }

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loginUserid.toString()) {
              return row.toUserId;
            }
            return row.fromUserId;
          });
      


        res.status(200).json({message:"coonnection request found",data:data});
    }
    catch(err)
    {
        res.status(401).send("error in connection request " + err.message);
    }
})

module.exports=userRouter;