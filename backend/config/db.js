import mongoose from "mongoose" ;

export const connectDB = async () =>{
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('MONGO_URI is not set. Please add it to your environment (.env).');
        throw new Error('Missing MONGO_URI environment variable');
    }
    try {
        await mongoose.connect(mongoUri);
        console.log('DB CONNECTED');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        throw err;
    }
}