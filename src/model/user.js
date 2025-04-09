const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({ 
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    password:{
        type:String,
        required:true,
        minlength:3,

    },
    age:{
        type:Number,
        default:18,
        validate(value)
        {
            if(value<0)
            {
                throw new send("age must be positive number");
            }
        }   
    },
    gender:{
        type:String,
        validate(value)
        {
            if(!["male","female","othe"].includes(value))
            {
                throw new send("gender is not valid");
            }

        }

    },
    gmail :{
        type:String,
        unique:true,
        required:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error("invalid email format" + value);
            }
        }


    },
    skil:{
        type:[String],
        validate(value)
        {
            if(value.length>10)
            {
                throw new Error("size of skil is too large"); 
            }
        }
    }
},
{
    Timestamp:true,
    versionKey:false,
}
);


/// always use normal function not arrow function in method
userSchema.methods.validPassword= async function (passwordInputByUser)
{
    const user=this; /// this will give the current user object
    const hashPassword=user.password;
    const isvalid= await bcrypt.compare(passwordInputByUser, hashPassword);
    return isvalid;
}

userSchema.methods.jwtGet= async function (){ /// always use normal function not arrow function in method
    const user=this; /// this will give the current user object
    const token= await jwt.sign({id:user._id},"vishal@123",{expiresIn:"1h"});

    return token;
}


module.exports=mongoose.model("user",userSchema); 