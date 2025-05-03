const mongoose = require("mongoose")

const signupSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{
        type:String,
        enum:["student","instructor"],
        default:"student"
    },
    photoUrl:{type:String,default:""},
    enrolledCourses:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }
},{timestamps:true})

const NewUsers = mongoose.model('NewUsers',signupSchema);

module.exports = NewUsers