import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connection.on('connected', ()=> console.log("Database Conected"));
        await mongoose.connect(`${process.env.MONGODB_URL}/Hotel-Booking`);
    }catch (error) {
        console.log(error.message);
        
    }
}

export default connectDB;