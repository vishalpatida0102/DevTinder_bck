const express=require("express");

const app=express();
/*
app.use("/hello", (req,res)=>{
    res.send("hello from /")
});

app.use("/ab+c",(req,res)=>{
    res.send("hello from new style from router")
});

app.use("/ab&r",(req,res)=>{
    res.send("hello user your are reached");

});

// get the data to user
app.get("/user",(req,res)=>{
    res.send({firstName:"vishal", lastName:"Patidar"});
});
//dynamic change
app.get("/user/:userId/:name/:sub",(req,res)=>{
    console.log(req.params);
    res.send({firstName:"vishal", lastName:"Patidar"});
});

//static change
app.get("/user",(req,res)=>{
    console.log(req.query);
    res.send({firstName:"vishal", lastName:"Patidar"});
});

*/
// app.use("/user",(req,res,next)=>
// {
//     console.log("router 1");
//     next();          //if we are change the order of next effect is we are move to next router response
//     res.send("response 1..");
    
// },(req,res)=>
// {
//     console.log("router 2");
//     res.send("response 2..");
// })


//middleware user and admin

// const userAuth=require("middleware/auth")
// app.use("/admin",userAuth);

// app.get("/admin/getdata",(req,res)=>{
//    res.send("admin data get")
// });


// insert data in database by api;



//XrJQBD8NIv4qYu1e
//mongodb+srv://vishalpatidarji2000:XrJQBD8NIv4qYu1e@devtinder.hoxxce4.mongodb.net/

// connetion of database



app.use(express.json());
const User=require("./model/user");
const {validateData}=require("./util/validator");
const bcrypt = require("bcrypt");

const Jwt = require("jsonwebtoken");
const cookieParser=require("cookie-parser");
app.use(cookieParser());
const {userAuth}=require("./middlewares/auth");
const authRouter=require("./Router/authRouter");
const profileRouter=require("./Router/profile");
const connectionRouter=require("./Router/connectionRouter");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);
 

const connectDB=require("./config/database");
connectDB()
.then(()=>{
    console.log("db connected");
    app.listen(3000 ,()=>{console.log("DONE")});
    
})
.catch((err)=>{
    console.log("error in db connection " + err);
});


// const User=require("./model/user");

// app.post("/signup", async (req,res)=>{
      
//      const user=new User({
        // firstName:"virat",
        // lastName:"kohli",
        // password:"123",
        // age:"12",
        // gender:"male",
//      });

//       await user.save();

//     res.send("data inserted");

// });


// insert data in database by using Dynamic API



 




     // signup Api
    // login Api

    

    

   
    // profile Api



// find a user by name 

// app.get("/user", async(req,res)=>{
//     const userage=req.body.age;
//   try{
    
//     const userData= await User.find({});
//     res.send(userData);
//   }catch(err)
//   {
//     res.status(401).send("error");
//   }
// })


//find all objects

// app.get("/feed", async(req,res)=>{
     
//   try{
    
//     const userData= await User.find({});
//     res.send(userData);
//   }catch(err)
//   {
//     res.status(401).send("error");
//   }
// })


//delete a user by id;

// app.delete("/delete", async(req,res)=>
// {
//   const userId=req.body.id;
//   try
//   {
//     const user=await User.findByIdAndDelete(userId);
//     res.send("user deleted succcessfullluy");
//   }
  // catch(err)
  // {
  //   res.send("erroo int delete");
  // }
// })


//update a user by id
const validator=require("validator");

app.patch("/update/:userId", async(req,res)=>{
  const data=req.body;
  const userId=req.params?.userId;

  try{
      if(data.skil.length>=10)
      {
        throw new Error("size of skil is too large"); 
      }
      const onlyUpdate=["firstName","gender","age","lastName","password","skil"];//we are update only this fields
      const isValid=Object.keys(data).every((k)=>onlyUpdate.includes(k));
      if(!isValid)
      {
        throw new  Error("some fields are not editable" +isValid);
      }

      if(!validator.isStrongPassword(data.password))
      {
        throw new Error("password is not strong format" + data.password);
      }
     const newData= await User.findByIdAndUpdate(userId,data,{runValidators:true});
     res.send("newData");
      }
      catch(err)
      {
        res.status(401).send("error in update" + err.message);
      }

}) 

