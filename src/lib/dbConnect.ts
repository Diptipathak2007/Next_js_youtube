import mongoose from "mongoose";
type ConnectionObject={
    isConnected?: number;
}
const connection: ConnectionObject = {};

async function dbConnect():Promise<void> {
    if (connection.isConnected) {
        console.log("Using existing database connection");
        return;
    }
    try{
       const db=await mongoose.connect(process.env.MONGO_URI || "",{})
       connection.isConnected=db.connections[0].readyState
       console.log("Database connected successfully:");
    }
    catch (error) {
        process.exit(1);
        console.error("Database connection failed:", error);
    }
}
export default dbConnect;