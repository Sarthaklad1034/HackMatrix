import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api';

const HackathonDetails = () => {
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedHackathon, setEditedHackathon] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchHackathonDetails = useCallback(async () => {
    try {
      const response = await api.get(`/hackathons/${id}`);
      setHackathon(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch hackathon details');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHackathonDetails();
  }, [fetchHackathonDetails]);

  const handleEdit = () => {
    setEditedHackathon({ ...hackathon });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setEditedHackathon(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setEditedHackathon(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/hackathons/${id}`, editedHackathon, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      setHackathon(response.data);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update hackathon');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this hackathon?')) {
      try {
        await api.delete(`/hackathons/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        navigate('/hackathons');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete hackathon');
      }
    }
  };

  const handleRegisterTeam = () => {
    navigate(`/hackathons/${id}/register-team`);
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!hackathon) return null;

  const isOrganizerOrAdmin = user && 
    (user._id === hackathon.organizer._id || user.role === 'admin');

  // Helper function to safely render items
  const renderListItems = (items, renderFn) => {
    if (!items || items.length === 0) return null;
    return items.map((item, index) => (
      <li key={index}>
        {renderFn(item)}
      </li>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {isEditing ? (
          <div>
            <input
              type="text"
              name="name"
              value={editedHackathon.name}
              onChange={handleEditChange}
              className="w-full text-3xl font-bold mb-4 p-2 border rounded"
            />
            <textarea
              name="description"
              value={editedHackathon.description}
              onChange={handleEditChange}
              className="w-full mb-4 p-2 border rounded"
              rows="4"
            />
            
            {/* Add more editable fields here similar to CreateHackathon */}
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">{hackathon.name}</h1>
              <div className="flex space-x-2">
                {isOrganizerOrAdmin && (
                  <>
                    <button 
                      onClick={handleEdit}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Event Details</h2>
                <p className="mb-2">{hackathon.description}</p>
                
                <div className="mb-4">
                  <strong>Theme:</strong> {hackathon.theme}
                </div>
                
                <div className="mb-4">
                  <strong>Dates:</strong>
                  <p>Start: {new Date(hackathon.startDate).toLocaleDateString()}</p>
                  <p>End: {new Date(hackathon.endDate).toLocaleDateString()}</p>
                </div>
                
                <div className="mb-4">
                  <strong>Registration Period:</strong>
                  <p>Opens: {new Date(hackathon.registrationStartDate).toLocaleDateString()}</p>
                  <p>Closes: {new Date(hackathon.registrationEndDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
                
                <div className="mb-4">
                  <strong>Location:</strong> {hackathon.location || 'Online/Hybrid'}
                  {hackathon.isVirtual && <span className="ml-2 text-green-600">(Virtual)</span>}
                </div>
                
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Challenges</h2>
                  <ul className="list-disc list-inside">
                    {renderListItems(hackathon.challenges, (challenge) => 
                      challenge.title || challenge.description || 'Unnamed Challenge'
                    )}
                  </ul>
                </div>

                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Sponsors</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {renderListItems(hackathon.sponsors, (sponsor) => 
                      sponsor.name || 'Unnamed Sponsor'
                    )}
                  </div>
                </div>

                {/* Registered Teams Section */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">Registered Teams</h2>
                  {hackathon.registeredTeams.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {hackathon.registeredTeams.map(team => (
                        <div 
                          key={team._id} 
                          className="border p-3 rounded shadow-sm"
                        >
                          <h3 className="font-bold">{team.name}</h3>
                          <p>{team.members.length} members</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No teams registered yet</p>
                  )}

                  {user && (
                    <button 
                      onClick={handleRegisterTeam}
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Register Team
                    </button>
                  )}
                </div>

                {/* Judges Section */}
                {hackathon.judges && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Judges</h2>
                    {hackathon.judges.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4">
                        {hackathon.judges.map(judge => (
                          <div 
                            key={judge._id} 
                            className="border p-3 rounded shadow-sm"
                          >
                            <h3 className="font-bold">{judge.name}</h3>
                            <p>{judge.email}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No judges assigned yet</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HackathonDetails;