import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const HackathonTeamRegistration = () => {
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ email: '' }]);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const response = await api.get(`/hackathons/${id}`);
        setHackathon(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch hackathon details');
        setLoading(false);
      }
    };

    fetchHackathonDetails();
  }, [id]);

  const handleAddMember = () => {
    setTeamMembers([...teamMembers, { email: '' }]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newMembers);
  };

  const handleMemberEmailChange = (index, email) => {
    const newMembers = [...teamMembers];
    newMembers[index].email = email;
    setTeamMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const teamData = {
        name: teamName,
        hackathonId: id,
        members: teamMembers.map(member => member.email)
      };

      const response = await api.post('/teams', teamData, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      navigate(`/hackathons/${id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to register team');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!hackathon) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Register Team for {hackathon.name}
        </h1>
        
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
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Team Members
            </label>
            {teamMembers.map((member, index) => (
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
              {loading ? 'Registering Team...' : 'Register Team'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/hackathons/${id}`)}
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

export default HackathonTeamRegistration;