import mongoose from "mongoose";
const registerSchema=new mongoose.Schema({
    companyId:{type:mongoose.Schema.Types.ObjectId,ref:'compnies'},
    studentId:{type:mongoose.Schema.Types.ObjectId,ref:'students'},
    scheduledDate:{type:Date},
    status:{type:String,enum:['pass','fail','on hold',"didn't attempt","registerd"]}
});
export const registerModel=new mongoose.model('registrations',registerSchema);

