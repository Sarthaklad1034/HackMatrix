import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

// Auth Components
import Login from './components/auth/login.jsx';
import Register from './components/auth/register.jsx';
import Profile from './components/auth/profile.jsx';

// Hackathon Components
import HackathonDashboard from './components/hackathon/HackathonDashboard';
import CreateHackathon from './components/hackathon/CreateHackathon';
import HackathonDetails from './components/hackathon/HackathonDetails';

// Team Components
import TeamCreation from './components/team/TeamCreation';
import TeamDashboard from './components/team/TeamDashboard';
import HackathonTeamRegistration from './components/team/HackathonTeamRegistration'; 

// Project Components
// import ProjectSubmission from './components/project/ProjectSubmission';
// import ProjectList from './components/project/ProjectList';
// import ProjectDetails from './components/project/ProjectDetails';

// // Judge Components
// import JudgeDashboard from './components/judge/JudgeDashboard';
// import EvaluationForm from './components/judge/EvaluationForm';

// Common Components
import Dashboard from './components/common/Dashboard';
import NotFound from './components/common/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          {/* <Navbar /> */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Private Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />

            {/* Hackathon Routes */}
            <Route 
              path="/hackathons" 
              element={
                <PrivateRoute>
                  <HackathonDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hackathons/create" 
              element={
                <PrivateRoute roles={['admin']}>
                  <CreateHackathon />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/hackathons/:id" 
              element={
                <PrivateRoute>
                  <HackathonDetails />
                </PrivateRoute>
              } 
            />
             <Route 
              path="/hackathons/:id/register-team" 
              element={
                <PrivateRoute roles={['participant']}>
                  <HackathonTeamRegistration />
                </PrivateRoute>
              } 
            />

            {/* Team Routes */}
            <Route 
              path="/teams/create" 
              element={
                <PrivateRoute roles={['participant']}>
                  <TeamCreation />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/teams" 
              element={
                <PrivateRoute>
                  <TeamDashboard />
                </PrivateRoute>
              } 
            />

            {/* Project Routes */}
            {/* <Route 
              path="/projects/submit" 
              element={
                <PrivateRoute roles={['participant']}>
                  <ProjectSubmission />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/projects" 
              element={
                <PrivateRoute>
                  <ProjectList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/projects/:id" 
              element={
                <PrivateRoute>
                  <ProjectDetails />
                </PrivateRoute>
              } 
            /> */}

            {/* Judge Routes */}
            {/* <Route 
              path="/judge/dashboard" 
              element={
                <PrivateRoute roles={['judge']}>
                  <JudgeDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/judge/evaluate/:projectId" 
              element={
                <PrivateRoute roles={['judge']}>
                  <EvaluationForm />
                </PrivateRoute>
              } 
            /> */}

            {/* Root Redirects */}
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;