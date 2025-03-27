import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { updateUserProfile, getUserProfile } from '../../utils/api';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        profile: null
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await getUserProfile();
                setProfileData(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    password: '',
                    confirmPassword: '',
                    profile: userData.profile || null
                });
            } catch (err) {
                setError('Failed to fetch profile data');
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        if (name === 'profile') {
            setFormData(prev => ({
                ...prev,
                profile: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        // Validate passwords
        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Prepare form data
            const updateData = {
                name: formData.name,
                email: formData.email
            };

            // Only add password if it's being changed
            if (formData.password) {
                updateData.password = formData.password;
            }

            // Handle profile image upload
            if (formData.profile instanceof File) {
                const formDataUpload = new FormData();
                formDataUpload.append('profile', formData.profile);
                // Implement file upload logic here
                // This might involve a separate API call for file upload
            }

            const response = await updateUserProfile(updateData);
            
            // Update user in context
            updateUser(response);
            
            setSuccess('Profile updated successfully');
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Profile update failed');
        } finally {
            setLoading(false);
        }
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
                    User Profile
                </h2>
                
                <div className="mb-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
                        {profileData.profile ? (
                            <img 
                                src={profileData.profile} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600">
                                No Image
                            </div>
                        )}
                    </div>
                    <p className="text-xl font-semibold">{profileData.name}</p>
                    <p className="text-gray-600">{profileData.email}</p>
                    <p className="text-gray-600 capitalize">Role: {profileData.role}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="profile" className="block text-sm font-medium text-gray-700">
                            Profile Picture
                        </label>
                        <input
                            id="profile"
                            name="profile"
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            New Password (optional)
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-green-500 text-sm text-center">
                            {success}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                loading 
                                    ? 'bg-gray-500 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;