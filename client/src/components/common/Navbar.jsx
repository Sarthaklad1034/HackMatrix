import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const navLinks = {
        participant: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Hackathons', path: '/hackathons' },
            { name: 'Teams', path: '/teams' },
            { name: 'Projects', path: '/projects' }
        ],
        judge: [
            { name: 'Dashboard', path: '/judge/dashboard' },
            { name: 'Projects', path: '/projects' }
        ],
        admin: [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Hackathons', path: '/hackathons' },
            { name: 'Create Hackathon', path: '/hackathons/create' }
        ]
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-indigo-600">
                            HackMatrix
                        </Link>
                    </div>
                    
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-4">
                                {navLinks[user?.role || 'participant']?.map((link) => (
                                    <Link 
                                        key={link.path} 
                                        to={link.path} 
                                        className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                            
                            <div className="relative group">
                                <Link 
                                    to="/profile" 
                                    className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium">{user?.name}</span>
                                </Link>
                            </div>
                            
                            <button 
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link 
                                to="/login" 
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;