import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api';

const CreateHackathon = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hackathonData, setHackathonData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationStartDate: '',
    registrationEndDate: '',
    theme: '',
    challenges: [],
    prizes: [],
    maxTeamSize: 4,
    location: '',
    isVirtual: false,
    tags: [],
    sponsors: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    if (type === 'checkbox') {
      setHackathonData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'tags' || name === 'challenges' || name === 'prizes' || name === 'sponsors') {
      // Handle array inputs
      setHackathonData(prev => ({
        ...prev,
        [name]: value.split(',').map(item => item.trim())
      }));
    } else {
      setHackathonData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!hackathonData.name) newErrors.name = 'Hackathon name is required';
    if (!hackathonData.description) newErrors.description = 'Description is required';
    if (!hackathonData.startDate) newErrors.startDate = 'Start date is required';
    if (!hackathonData.endDate) newErrors.endDate = 'End date is required';
    if (!hackathonData.registrationStartDate) newErrors.registrationStartDate = 'Registration start date is required';
    if (!hackathonData.registrationEndDate) newErrors.registrationEndDate = 'Registration end date is required';
    
    // Date validations
    if (new Date(hackathonData.startDate) > new Date(hackathonData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (new Date(hackathonData.registrationStartDate) > new Date(hackathonData.registrationEndDate)) {
      newErrors.registrationEndDate = 'Registration end date must be after registration start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await api.post('/hackathons', hackathonData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      // Redirect to hackathon dashboard or details page
      navigate(`/hackathons/${response.data._id}`);
    } catch (error) {
      console.error('Hackathon creation failed:', error.response?.data || error.message);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to create hackathon'
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Hackathon</h1>
      
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        {/* Basic Information */}
        <div className="mb-4">
          <label className="block mb-2">Hackathon Name</label>
          <input
            type="text"
            name="name"
            value={hackathonData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter hackathon name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={hackathonData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Describe your hackathon"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Date Sections */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={hackathonData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
          </div>
          <div>
            <label className="block mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={hackathonData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Registration Start Date</label>
            <input
              type="date"
              name="registrationStartDate"
              value={hackathonData.registrationStartDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.registrationStartDate && <p className="text-red-500 text-sm">{errors.registrationStartDate}</p>}
          </div>
          <div>
            <label className="block mb-2">Registration End Date</label>
            <input
              type="date"
              name="registrationEndDate"
              value={hackathonData.registrationEndDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.registrationEndDate && <p className="text-red-500 text-sm">{errors.registrationEndDate}</p>}
          </div>
        </div>

        {/* Additional Details */}
        <div className="mb-4">
          <label className="block mb-2">Theme</label>
          <input
            type="text"
            name="theme"
            value={hackathonData.theme}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Hackathon theme"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Challenges (comma-separated)</label>
          <input
            type="text"
            name="challenges"
            value={hackathonData.challenges.join(', ')}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g. AI, Web3, Sustainability"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Prizes (comma-separated)</label>
          <input
            type="text"
            name="prizes"
            value={hackathonData.prizes.join(', ')}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g. $5000, MacBook, Cloud Credits"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2">Max Team Size</label>
            <input
              type="number"
              name="maxTeamSize"
              value={hackathonData.maxTeamSize}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label className="block mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={hackathonData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Hackathon location"
            />
          </div>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isVirtual"
            checked={hackathonData.isVirtual}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Virtual Hackathon</label>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={hackathonData.tags.join(', ')}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g. technology, innovation, startup"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Sponsors (comma-separated)</label>
          <input
            type="text"
            name="sponsors"
            value={hackathonData.sponsors.join(', ')}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Hackathon sponsors"
          />
        </div>

        {errors.submit && (
          <div className="mb-4 text-red-500">
            {errors.submit}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Hackathon
        </button>
      </form>
    </div>
  );
};

export default CreateHackathon;