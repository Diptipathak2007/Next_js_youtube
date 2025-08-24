import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    // Check if already connected
    if (connection.isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        console.log("Attempting to connect to MongoDB...");
        
        // Use the correct environment variable name
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        console.log("MongoDB URI found, connecting...");
        
        const db = await mongoose.connect(mongoUri, {
            // Add useful connection options
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        
        connection.isConnected = db.connections[0].readyState;
        console.log("✅ Database connected successfully!");
        
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        
        // Log more details about the error
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
        }
        
        // Don't kill the entire process, just throw the error
        // Let the calling function handle it
        throw error;
    }
}

export default dbConnect;