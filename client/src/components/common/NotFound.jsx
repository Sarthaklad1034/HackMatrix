import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
                <h2 className="text-3xl mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8">
                    The page you are looking for might have been removed or doesn't exist.
                </p>
                <Link 
                    to="/" 
                    className="btn-primary"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;