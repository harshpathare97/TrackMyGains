import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

export default connectToMongoDB;