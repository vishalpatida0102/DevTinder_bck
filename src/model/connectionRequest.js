const mongoose = require('mongoose');

const connectionSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,// type of id
        required:true,
        ref:"user", //reference to the user model
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    status:{
        type:String,
        required:true,
        enum:{   //costom validator
            values:["ignored","interested","rejected","accepted"],
            message:`{values} incorrect status,type`,
        },
    },
   

},
{
    timestamps:true,
    
}
)



const connectionRequestModel=new mongoose.model("connectionRequest",connectionSchema);

module.exports=connectionRequestModel;
// const connectionRequestModel=require("../model/connectionRequest");