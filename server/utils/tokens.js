// utils/tokens.js
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Generate random token
export const generateRandomToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

// Generate JWT token
export const generateJWTToken = (payload, secret = process.env.JWT_SECRET, expiresIn = '1d') => {
    return jwt.sign(payload, secret, { expiresIn });
};

// Verify JWT token
export const verifyJWTToken = (token, secret = process.env.JWT_SECRET) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};

// Generate email verification token
export const generateVerificationToken = () => {
    return crypto.randomBytes(20).toString('hex');
};

// Generate password reset token
export const generatePasswordResetToken = () => {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    return {
        resetToken,
        hashedToken,
        expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
};