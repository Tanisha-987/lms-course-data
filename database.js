const mongoose = require("mongoose");

require('dotenv').config();

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true
        })
        console.log("connected successfully");
    }
    catch(error){
        console.log(error);
        console.log("error occured");
    }
}

module.exports=connectDB