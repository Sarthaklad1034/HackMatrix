// utils/validations.js
import validator from 'validator';

// Email validation
export const validateEmail = (email) => {
    if (!email) {
        throw new Error('Email is required');
    }
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
    return true;
};

// Password validation
export const validatePassword = (password) => {
    if (!password) {
        throw new Error('Password is required');
    }
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
        throw new Error('Password must include uppercase, lowercase, number, and special character');
    }
    return true;
};

// Name validation
export const validateName = (name) => {
    if (!name) {
        throw new Error('Name is required');
    }
    if (name.length < 2 || name.length > 50) {
        throw new Error('Name must be between 2 and 50 characters');
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        throw new Error('Name can only contain letters and spaces');
    }
    return true;
};

// URL validation
export const validateURL = (url, type = 'generic') => {
    if (!url) {
        throw new Error('URL is required');
    }

    switch (type) {
        case 'github':
            if (!/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?$/.test(url)) {
                throw new Error('Invalid GitHub repository URL');
            }
            break;
        case 'video':
            if (!/^(https?:\/\/)?(www\.)?(youtube\.com|vimeo\.com)\/.+$/.test(url)) {
                throw new Error('Invalid video URL. Must be YouTube or Vimeo');
            }
            break;
        default:
            if (!validator.isURL(url)) {
                throw new Error('Invalid URL format');
            }
    }
    return true;
};

// Team size validation
export const validateTeamSize = (size, maxSize = 6, minSize = 1) => {
    if (!size || typeof size !== 'number') {
        throw new Error('Team size must be a number');
    }
    if (size < minSize || size > maxSize) {
        throw new Error(`Team size must be between ${minSize} and ${maxSize}`);
    }
    return true;
};

// Phone number validation (optional)
export const validatePhoneNumber = (phone) => {
    if (!phone) {
        throw new Error('Phone number is required');
    }
    if (!validator.isMobilePhone(phone, 'any')) {
        throw new Error('Invalid phone number format');
    }
    return true;
};

// Create validation middleware
export const validate = (validations) => {
    return async(req, res, next) => {
        const errors = [];

        for (let validation of validations) {
            try {
                await validation.validate(req.body[validation.field], {
                    abortEarly: false
                });
            } catch (err) {
                errors.push(...err.errors);
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        next();
    };
};