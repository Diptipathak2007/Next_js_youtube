/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * 
 * This function checks if there is an existing connection to the database.
 * If a connection already exists, it logs a message and returns early.
 * If no connection exists, it attempts to connect to the database using the 
 * MONGO_URI environment variable. Upon successful connection, it updates 
 * the connection state and logs a success message. In case of an error, 
 * it logs the error and exits the process.
 * 
 * @returns {Promise<void>} A promise that resolves when the connection 
 * has been established or an error occurs.
 * 
 * @algorithm
 * 1. Check if the connection is already established.
 * 2. If yes, log "Using existing database connection" and return.
 * 3. If no, attempt to connect to the database:
 *    a. Use mongoose.connect with the MONGO_URI.
 *    b. Update the connection state based on the result.
 *    c. Log "Database connected successfully" if successful.
 * 4. If an error occurs during connection, log the error and exit the process.
 */
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

