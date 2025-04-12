const express=require("express");
const userRouter=express.Router();
const {userAuth}= require("../middlewares/auth");
const User=require("../model/user");
const connectionRequestSchema=require("../model/connectionRequest");


userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{

        const receivedId=req.User._id;

        const connectionRequest=await connectionRequestSchema.find({toUserId:receivedId,status:"interested"})
        .populate("fromUserId","firstName lastName");
        
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



userRouter.get("/user/request/connection",userAuth,async(req,res)=>{
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


userRouter.get("/user/request/feed",userAuth,async(req,res)=>{
    try{

         const senderId=req.User._id;
         const loginUserId=req.User._id;
         const receivedId=req.User._id;
         const userData=await User.find({});

         const page=parseInt(req.query.page) ||1;
         let limit=parseInt(req.query.limit)||10;

         limit=limit>=50?50:limit; // if user put to more limit so, sanetize it

         const skip=(page-1)*limit;


        const loginUser=req.User._id;

        const connectionIds=await connectionRequestSchema.find(
            {$or:[{fromUserId:loginUser._id},{toUserId:loginUser._id}]}
        ).select("fromUserId toUserId");

        const hiddenData=new Set();

        connectionIds.forEach((data)=>{
            hiddenData.add(data.fromUserId.toString());
            hiddenData.add(data.toUserId.toString());
        });

        const feedData=await User.find({
            $and:[{_id:{$nin:Array.from(hiddenData)}},{_id:{
                $ne:loginUser._id
            }}]
        }).select("firstName lastName age skills")
        .skip(skip)
        .limit(limit);

        res.json({data:feedData});
 
    }
    catch(err)
    {
        res.status(401).send("error in connection request " + err.message);
    }
});

module.exports=userRouter;