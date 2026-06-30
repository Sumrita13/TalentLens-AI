import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Dashboard from './pages/Dashboard';
import UploadDataset from './pages/UploadDataset';
import Rankings from './pages/Rankings';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Navbar from './components/Navbar';
import JobDescriptionManagement from './pages/JobDescriptionManagement';
import CandidateExplorer from './pages/CandidateExplorer';
import CandidateDetails from './pages/CandidateDetails';
import CandidateComparison from './pages/CandidateComparison';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Settings from './pages/Settings';
import { AuthProvider, AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: ('candidate' | 'recruiter')[] }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0f0f15]">
          <Navbar />
          <main className="w-full flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute allowedRoles={['recruiter']}><UploadDataset /></ProtectedRoute>} />
              <Route path="/rankings" element={<ProtectedRoute allowedRoles={['recruiter']}><Rankings /></ProtectedRoute>} />
              <Route path="/jd-management" element={<ProtectedRoute allowedRoles={['recruiter']}><JobDescriptionManagement /></ProtectedRoute>} />
              <Route path="/candidates" element={<ProtectedRoute allowedRoles={['recruiter']}><CandidateExplorer /></ProtectedRoute>} />
              <Route path="/candidate/:id" element={<ProtectedRoute allowedRoles={['recruiter']}><CandidateDetails /></ProtectedRoute>} />
              <Route path="/compare" element={<ProtectedRoute allowedRoles={['recruiter']}><CandidateComparison /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute allowedRoles={['recruiter']}><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={['recruiter']}><Settings /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
