import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

 const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("DB connected successfully")
        
    } catch (error) {
        console.log("Error occur while DB connection")
        process.exit(1);
    }
}

export default connectDb;