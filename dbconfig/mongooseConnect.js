import mongoose from 'mongoose';
export const mongooseConnect=async()=>{
    await mongoose.connect(process.env.dbUrl)
    .then(()=>{
        console.log('db id connected');
    })
    .catch((err)=>{
        console.log('there was some error while connecting to the database');
    })
}