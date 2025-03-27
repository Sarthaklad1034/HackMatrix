import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const TeamCreation = () => {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([{ email: '' }]);
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathon, setSelectedHackathon] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await api.get('/hackathons');
        setHackathons(response.data);
      } catch (error) {
        setError('Failed to fetch hackathons');
      }
    };

    fetchHackathons();
  }, []);

  const handleAddMember = () => {
    setMembers([...members, { email: '' }]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleMemberEmailChange = (index, email) => {
    const newMembers = [...members];
    newMembers[index].email = email;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const teamData = {
        name: teamName,
        members: members.map(member => member.email),
        hackathonId: selectedHackathon,
        leaderId: user._id
      };

      const response = await api.post('/teams/create', teamData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      navigate('/teams');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Team</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teamName">
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hackathon">
              Select Hackathon
            </label>
            <select
              id="hackathon"
              value={selectedHackathon}
              onChange={(e) => setSelectedHackathon(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a Hackathon</option>
              {hackathons.map(hackathon => (
                <option key={hackathon._id} value={hackathon._id}>
                  {hackathon.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Team Members
            </label>
            {members.map((member, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) => handleMemberEmailChange(index, e.target.value)}
                  placeholder="Member email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMember}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Add Member
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {loading ? 'Creating Team...' : 'Create Team'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/teams')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamCreation;