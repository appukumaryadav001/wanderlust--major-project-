import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
    const conn = await mongoose.connect(`${process.env.MONGO_URL}`);

    console.log(`\n MongoDB connect || DB HOST : ${conn.connection.host}`);
    }catch(error){
        console.log("MongoDB connection Error : ",error);
        process.exit(1);
        
    }
}

export {connectDB};