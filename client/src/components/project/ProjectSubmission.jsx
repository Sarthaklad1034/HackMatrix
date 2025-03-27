import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const ProjectSubmission = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    technologies: '',
    hackathonId: '', // Optional: Link to a specific hackathon
    teamId: '', // Optional: Link to a team
    status: 'draft'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!projectData.title.trim()) {
      newErrors.title = 'Project title is required';
    }
    
    if (!projectData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      const submissionData = {
        ...projectData,
        userId: user.id,
        submittedAt: new Date().toISOString()
      };

      console.log('Submitting Project:', submissionData);
      
      // Simulated API submission
      // const response = await api.createProject(submissionData);
      
      // Show success message
      alert('Project submitted successfully!');
      
      // Redirect to projects list
      navigate('/projects');
    } catch (error) {
      console.error('Project submission error:', error);
      alert('Failed to submit project. Please try again.');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Project Title</label>
              <Input 
                type="text"
                name="title"
                value={projectData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Description</label>
              <Textarea 
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                placeholder="Describe your project in detail"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Technologies Used</label>
              <Input 
                type="text"
                name="technologies"
                value={projectData.technologies}
                onChange={handleInputChange}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block mb-2">Project Status</label>
              <Select 
                value={projectData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/projects')}
              >
                Cancel
              </Button>
              <Button type="submit">
                Submit Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSubmission;