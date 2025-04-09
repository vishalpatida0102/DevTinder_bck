   const Jwt=require("jsonwebtoken");
   
   const User=require("../model/user");
   
   const userAuth= async (req,res,next)=>{
       try{
           const cookie=req.cookies;
           const {token}=cookie;
           if(!token)
           {
             throw new Error("token is invalid");
     
           }
           const verifyToken= await Jwt.verify(token,"vishal@123");
     
           const {id}=verifyToken;
           const user=await User.findById(id);
           if(!user)
           {
             throw new Error("user not found");
           }
           req.User=user;
           next();
         }
         catch(err)
           {
             res.status(401).send("error in profile " + err.message);
           }
};

module.exports={userAuth}