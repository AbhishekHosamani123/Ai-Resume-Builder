import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

export const protect = async (req,res,next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            
            const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
            const decoded = jwt.verify(token, jwtSecret)
            
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }
            next();

        } else {
            res.status(401).json({ message: "Not authorized, no token found" })
        }
        
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        // Return 401 for all auth-related errors instead of 500
        res.status(401).json({
             message: "Authentication failed",
            error: error.message
            })
    }
}