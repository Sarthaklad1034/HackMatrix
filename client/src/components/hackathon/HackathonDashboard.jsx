// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import api from '../../utils/api';

// const HackathonDashboard = () => {
//   const [hackathons, setHackathons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     status: '',
//     theme: '',
//     tags: ''
//   });
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const fetchHackathons = useCallback(async () => {
//     try {
//       const queryParams = new URLSearchParams();
//       if (filters.status) queryParams.append('status', filters.status);
//       if (filters.theme) queryParams.append('theme', filters.theme);
//       if (filters.tags) queryParams.append('tags', filters.tags);

//       const response = await api.get(`/hackathons?${queryParams.toString()}`);
//       setHackathons(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching hackathons:', error);
//       setLoading(false);
//     }
//   }, [filters]);

//   useEffect(() => {
//     fetchHackathons();
//   }, [fetchHackathons]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleCreateHackathon = () => {
//     navigate('/hackathons/create');
//   };

//   const renderHackathonCard = (hackathon) => {
//     return (
//       <div key={hackathon._id} className="border rounded p-4 mb-4 shadow-md">
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-xl font-bold">{hackathon.name}</h2>
//           <span className="text-sm text-gray-600">{hackathon.theme}</span>
//         </div>
//         <p className="text-gray-500 mb-2">{hackathon.description}</p>
        
//         <div className="flex justify-between items-center">
//           <div>
//             <p>Start Date: {new Date(hackathon.startDate).toLocaleDateString()}</p>
//             <p>End Date: {new Date(hackathon.endDate).toLocaleDateString()}</p>
//           </div>
          
//           <div>
//             <Link 
//               to={`/hackathons/${hackathon._id}`} 
//               className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//             >
//               View Details
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Hackathon Dashboard</h1>
//         {user && (user.role === 'organizer' || user.role === 'admin') && (
//           <button 
//             onClick={handleCreateHackathon}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//           >
//             Create Hackathon
//           </button>
//         )}
//       </div>

//       {/* Filters */}
//       <div className="mb-6 grid grid-cols-3 gap-4">
//         <div>
//           <label className="block mb-2">Status</label>
//           <select 
//             name="status" 
//             value={filters.status} 
//             onChange={handleFilterChange}
//             className="w-full p-2 border rounded"
//           >
//             <option value="">All Statuses</option>
//             <option value="upcoming">Upcoming</option>
//             <option value="ongoing">Ongoing</option>
//             <option value="completed">Completed</option>
//           </select>
//         </div>

//         <div>
//           <label className="block mb-2">Theme</label>
//           <input 
//             type="text" 
//             name="theme" 
//             value={filters.theme} 
//             onChange={handleFilterChange}
//             className="w-full p-2 border rounded"
//             placeholder="Filter by theme"
//           />
//         </div>

//         <div>
//           <label className="block mb-2">Tags</label>
//           <input 
//             type="text" 
//             name="tags" 
//             value={filters.tags} 
//             onChange={handleFilterChange}
//             className="w-full p-2 border rounded"
//             placeholder="Comma-separated tags"
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center">Loading hackathons...</div>
//       ) : hackathons.length === 0 ? (
//         <div className="text-center text-gray-500">No hackathons found</div>
//       ) : (
//         <div>
//           {hackathons.map(renderHackathonCard)}
//         </div>
//       )}
//     </div>
//   );
// };

// export default HackathonDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const HackathonDashboard = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    theme: '',
    tags: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const fetchHackathons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.theme) queryParams.append('theme', filters.theme);
      if (filters.tags) queryParams.append('tags', filters.tags);

      const response = await api.get(`/hackathons?${queryParams.toString()}`);
      setHackathons(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Detailed Error fetching hackathons:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      setError({
        message: error.message,
        details: error.response?.data || 'Unknown error occurred',
        status: error.response?.status
      });
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateHackathon = () => {
    navigate('/hackathons/create');
  };

  const renderHackathonCard = (hackathon) => {
    return (
      <div key={hackathon._id} className="border rounded p-4 mb-4 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">{hackathon.name}</h2>
          <span className="text-sm text-gray-600">{hackathon.theme}</span>
        </div>
        <p className="text-gray-500 mb-2">{hackathon.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <p>Start Date: {new Date(hackathon.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(hackathon.endDate).toLocaleDateString()}</p>
          </div>
          
          <div>
            <Link 
              to={`/hackathons/${hackathon._id}`} 
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  // Error rendering
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error Loading Hackathons</strong>
          <span className="block sm:inline"> {error.message}</span>
          {error.status && (
            <p className="text-sm">Status Code: {error.status}</p>
          )}
          {error.details && (
            <details className="mt-2 text-sm text-gray-600">
              <summary>Error Details</summary>
              <pre>{JSON.stringify(error.details, null, 2)}</pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hackathon Dashboard</h1>
        {user && (user.role === 'organizer' || user.role === 'admin') && (
          <button 
            onClick={handleCreateHackathon}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create Hackathon
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div>
          <label className="block mb-2">Status</label>
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Theme</label>
          <input 
            type="text" 
            name="theme" 
            value={filters.theme} 
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
            placeholder="Filter by theme"
          />
        </div>

        <div>
          <label className="block mb-2">Tags</label>
          <input 
            type="text" 
            name="tags" 
            value={filters.tags} 
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
            placeholder="Comma-separated tags"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center">Loading hackathons...</div>
      ) : hackathons.length === 0 ? (
        <div className="text-center text-gray-500">No hackathons found</div>
      ) : (
        <div>
          {hackathons.map(renderHackathonCard)}
        </div>
      )}
    </div>
  );
};

export default HackathonDashboard;