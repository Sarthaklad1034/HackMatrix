import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const TeamDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [teamsResponse, invitesResponse] = await Promise.all([
          api.get('/teams', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          }),
          api.get('/teams/invites', {
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
        ]);

        setTeams(teamsResponse.data);
        setPendingInvites(invitesResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch team data');
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [user]);

  const handleAcceptInvite = async (inviteId) => {
    try {
      await api.post(`/teams/invites/${inviteId}/accept`, {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      // Refetch teams and invites
      const [teamsResponse, invitesResponse] = await Promise.all([
        api.get('/teams', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }),
        api.get('/teams/invites', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        })
      ]);

      setTeams(teamsResponse.data);
      setPendingInvites(invitesResponse.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to accept invite');
    }
  };

  const handleDeclineInvite = async (inviteId) => {
    try {
      await api.post(`/teams/invites/${inviteId}/decline`, {}, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      setPendingInvites(pendingInvites.filter(invite => invite._id !== inviteId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to decline invite');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Teams</h1>
          <Link 
            to="/teams/create" 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Team
          </Link>
        </div>

        {pendingInvites.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Pending Team Invites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingInvites.map(invite => (
                <div key={invite._id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-bold mb-2">{invite.team.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Hackathon: {invite.team.hackathon.name}</p>
                  <p className="text-sm text-gray-600 mb-4">Invited by: {invite.invitedBy.name}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptInvite(invite._id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeclineInvite(invite._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-semibold mb-4">My Teams</h2>
          {teams.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              <p>You are not a member of any teams yet.</p>
              <Link 
                to="/teams/create" 
                className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
              >
                Create Your First Team
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map(team => (
                <div 
                  key={team._id} 
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Hackathon: {team.hackathon.name}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">Members:</span>
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 3).map(member => (
                        <div 
                          key={member._id} 
                          className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold"
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {team.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                          +{team.members.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/teams/${team._id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      View Details
                    </Link>
                    {team.leader._id === user._id && (
                      <button 
                        onClick={() => navigate(`/teams/${team._id}/manage`)}
                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded"
                      >
                        Manage
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;