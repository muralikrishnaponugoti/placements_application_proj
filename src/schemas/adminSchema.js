import mongoose from "mongoose";
const adminSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true}
});
export const adminsModel=new mongoose.model('admins',adminSchema);