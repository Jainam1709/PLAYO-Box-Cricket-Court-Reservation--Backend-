import mongoose from 'mongoose';
 const connectDB = async (DATABASE_URL)=>{
    try{
        const DB_OPTIONS = {
            dbName: "playo_boxcricket_login"
        }
        await mongoose.connect(DATABASE_URL, DB_OPTIONS)
        console.log("Connection Successfully with database...")
    }
    catch(error){
        console.log(error)

    }

 } 
 export default connectDB