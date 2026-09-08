import React, { useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import JudgeDemoBar from './components/JudgeDemoBar';
import { MOCK_USERS } from './data/mockData';

function AppContent() {
  const [currentRoleKey, setCurrentRoleKey] = useState('government');
  const [demoStep, setDemoStep] = useState(1);
  const navigate = useNavigate();

  const handleRoleChange = (roleKey) => {
    setCurrentRoleKey(roleKey);
  };

  const handleDemoNavigate = (route, role) => {
    if (role && role !== currentRoleKey) {
      setCurrentRoleKey(role);
    }
    navigate(route);
  };

  const currentUser = MOCK_USERS[currentRoleKey] || MOCK_USERS.government;

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-[#123B73]">
      <JudgeDemoBar
        currentStep={demoStep}
        onStepChange={(s) => setDemoStep(s)}
        onNavigate={handleDemoNavigate}
      />
      <AppRoutes currentUser={currentUser} onRoleChange={handleRoleChange} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
