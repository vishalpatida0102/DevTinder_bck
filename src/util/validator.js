const validator=require("validator");
const User=require("../model/user");


const validateData =(req)=>
{
    
const {firstName,lastName,password,gmail,skil}=req.body;

if(!firstName || !lastName)
{
    throw new Error("first name and last name are required");
}
else if(!validator.isStrongPassword(password))
{
    throw new Error("password is not strong enough");
}

else if(!validator.isEmail(gmail))
{
    throw new Error("invalid email format" + gmail);
}

 
}


const validateEditData=(req)=>
{
    const editableFields=["firstName","lastName","skil","age","gmail","gender"];
    const isValid=Object.keys(req.body).every((key)=>editableFields.includes(key));

    if(!isValid)
    {
        throw new Error("invalid field to edit");
    }
    else
    {
        return true;
    }

}

module.exports ={validateData,validateEditData};