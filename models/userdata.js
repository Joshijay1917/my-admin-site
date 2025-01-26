import mongoose from "mongoose";

let User = mongoose.Schema({
    username: {type:String, uniQue:true},
    password: String,
    email: {type:String, unique:true},
})

export const user = mongoose.model('Users', User)