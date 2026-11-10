import mongoose from "mongoose";

 export const connectdb =  async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongodb connected successfully")
    } catch (error) {
        console.log("error in db.js");
        process.exit(1);
    }
 }