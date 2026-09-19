import mongoose from "mongoose";

// Cache the connection on globalThis so serverless environments (e.g. Vercel
// functions) reuse it across invocations instead of opening a new one per request.
const cached = globalThis.__mongooseCache || (globalThis.__mongooseCache = { conn: null, promise: null });

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('MONGO_URI is not set. Please add it to your environment (.env).');
        throw new Error('Missing MONGO_URI environment variable');
    }
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(mongoUri)
            .then((conn) => {
                cached.conn = conn;
                console.log('DB CONNECTED');
                return conn;
            })
            .catch((err) => {
                cached.promise = null;
                console.error('Failed to connect to MongoDB:', err.message);
                throw err;
            });
    }
    return cached.promise;
};
