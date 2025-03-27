import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState({});

  // Simulated data fetch (replace with actual API call)
  useEffect(() => {
    const mockProject = {
      id: 1,
      title: 'Smart Campus Navigation',
      description: 'An AI-powered campus navigation app that helps students and faculty navigate complex campus layouts using machine learning.',
      status: 'in-progress',
      technologies: 'React, TensorFlow, Python',
      hackathonId: 1,
      hackathonName: 'Tech Innovation Hackathon',
      teamName: 'Tech Innovators',
      teamMembers: [
        { id: 1, name: 'John Doe', role: 'Frontend Developer' },
        { id: 2, name: 'Jane Smith', role: 'Backend Developer' }
      ],
      submittedAt: '2024-03-15',
      projectProgress: 65,
      githubLink: 'https://github.com/techninjas/smart-campus-nav',
      additionalResources: []
    };

    setProject(mockProject);
    setEditedProject(mockProject);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProject = () => {
    // TODO: Implement actual API update
    console.log('Updated Project:', editedProject);
    setProject(editedProject);
    setIsEditing(false);
  };

  const getStatusVariant = (status) => {
    switch(status) {
      case 'draft': return 'secondary';
      case 'in-progress': return 'primary';
      case 'completed': return 'success';
      default: return 'outline';
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          {isEditing ? (
            <Input 
              name="title"
              value={editedProject.title}
              onChange={handleInputChange}
              className="text-2xl font-bold"
            />
          ) : (
            <div>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>
                Submitted for {project.hackathonName}
              </CardDescription>
            </div>
          )}
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProject(project);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveProject}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Project
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Project Details</h3>
              {isEditing ? (
                <>
                  <Textarea 
                    name="description"
                    value={editedProject.description}
                    onChange={handleInputChange}
                    className="mb-2"
                    rows={4}
                  />
                  <Input 
                    name="technologies"
                    value={editedProject.technologies}
                    onChange={handleInputChange}
                    placeholder="Technologies used"
                    className="mb-2"
                  />
                </>
              ) : (
                <>
                  <p className="mb-2">{project.description}</p>
                  <p>
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                </>
              )}
              
              <div className="mt-4">
                <strong>Status:</strong>{' '}
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status}
                </Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Project Metrics</h3>
              <div className="space-y-2">
                <div>
                  <label className="block mb-1">Project Progress</label>
                  <Progress value={project.projectProgress} />
                  <p className="text-sm text-muted-foreground">
                    {project.projectProgress}% Complete
                  </p>
                </div>

                <div>
                  <strong>Team:</strong> {project.teamName}
                  <ul className="list-disc list-inside text-sm">
                    {project.teamMembers.map(member => (
                      <li key={member.id}>
                        {member.name} - {member.role}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong>Submitted:</strong>{' '}
                  {new Date(project.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">Additional Resources</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  View Project Resources
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Project Resources</DialogTitle>
                </DialogHeader>
                <div>
                  <strong>GitHub Repository:</strong>
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block"
                  >
                    {project.githubLink}
                  </a>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetails;