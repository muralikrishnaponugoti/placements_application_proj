import mongoose from "mongoose";
const companieSchema=new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    jd:{type:String},
    aplDeadLine:{type:Date},
    cmpnymail:{type:String,required:true,unique:true},
    registerations:[{type:mongoose.Schema.Types.ObjectId,ref:'registrations',unique:true}]
});
export const companiesModel=new mongoose.model('compnies',companieSchema);