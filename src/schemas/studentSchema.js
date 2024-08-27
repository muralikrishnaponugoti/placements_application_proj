import mongoose from "mongoose";
const studentSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    college:{type:String},
    batch:{type:String},
    dsaScore:{type:Number},
    webDScore:{type:Number},
    reactScore:{type:Number},
    registerations:[{type:mongoose.Schema.Types.ObjectId,ref:'registrations'}]
});
export const studentsModel=new mongoose.model('students',studentSchema);