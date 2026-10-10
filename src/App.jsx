import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import InterviewsPage from './pages/InterviewsPage';
import InterviewFormPage from './pages/InterviewFormPage';
import CareerIntelligencePage from './pages/CareerIntelligencePage';
import ProfilePage from './pages/ProfilePage';
import ResumePage from './pages/ResumePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  const homePath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={homePath} replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to={homePath} replace /> : <RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/add" element={<ApplicationFormPage />} />
            <Route path="/applications/edit/:id" element={<ApplicationFormPage />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/interviews/add" element={<InterviewFormPage />} />
            <Route path="/career-intelligence" element={<CareerIntelligencePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
