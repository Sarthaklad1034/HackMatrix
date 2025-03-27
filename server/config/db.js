import mongoose from 'mongoose';

// Database connection function
export const connectDB = async() => {
    try {
        // Attempt to connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Options to handle deprecation warnings and improve connection
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Optional: If you want to enable indexing
            // autoIndex: process.env.NODE_ENV !== 'production'
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

// Optional: Add mongoose connection event listeners
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
});