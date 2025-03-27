import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    hackathon: 'all'
  });

  // Simulated data fetch (replace with actual API call)
  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        title: 'Smart Campus Navigation',
        description: 'An AI-powered campus navigation app',
        status: 'in-progress',
        technologies: 'React, TensorFlow',
        hackathonId: 1,
        hackathonName: 'Tech Innovation Hackathon',
        teamName: 'Tech Innovators',
        submittedAt: '2024-03-15'
      },
      {
        id: 2,
        title: 'Eco-Tracker',
        description: 'Carbon footprint tracking application',
        status: 'completed',
        technologies: 'Vue.js, Node.js',
        hackathonId: 2,
        hackathonName: 'Sustainability Hack',
        teamName: 'Green Solutions',
        submittedAt: '2024-02-20'
      }
    ];

    setProjects(mockProjects);
    setFilteredProjects(mockProjects);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = projects;

    if (filters.status !== 'all') {
      result = result.filter(project => project.status === filters.status);
    }

    if (filters.hackathon !== 'all') {
      result = result.filter(project => project.hackathonId === parseInt(filters.hackathon));
    }

    setFilteredProjects(result);
  }, [filters, projects]);

  const getStatusVariant = (status) => {
    switch(status) {
      case 'draft': return 'secondary';
      case 'in-progress': return 'primary';
      case 'completed': return 'success';
      default: return 'outline';
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Projects</CardTitle>
            <Button 
              onClick={() => navigate('/projects/submit')}
            >
              Submit New Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div>
              <label className="block mb-2">Status</label>
              <Select 
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2">Hackathon</label>
              <Select 
                value={filters.hackathon}
                onValueChange={(value) => handleFilterChange('hackathon', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select hackathon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hackathons</SelectItem>
                  <SelectItem value="1">Tech Innovation Hackathon</SelectItem>
                  <SelectItem value="2">Sustainability Hack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Hackathon</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map(project => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.hackathonName}</TableCell>
                  <TableCell>{project.teamName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{project.technologies}</TableCell>
                  <TableCell>
                    {new Date(project.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredProjects.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No projects found. Submit your first project!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectList;