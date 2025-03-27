import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Middleware to protect routes - Verify JWT token
export const protect = asyncHandler(async(req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const token = authHeader.split(' ')[1]; // Extract token from header
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from token, exclude password
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. User not found.' });
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('JWT Verification Error:', error);
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

// Middleware for role-based authorization
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized access.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access forbidden. User role '${req.user.role}' does not have permission.`,
            });
        }

        next(); // Proceed to the next middleware
    };
};