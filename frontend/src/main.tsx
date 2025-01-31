import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import Auth from './pages/Auth.tsx';
import AddSecret from './pages/AddSecret.tsx'; // Import the AddSecret component
import './index.css';

// Mock authentication state (replace with actual auth logic)
const isAuthenticated = localStorage.getItem('token') !== null; // Check if token exists

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/add-secret" replace /> // Redirect to /add-secret if authenticated
            ) : (
              <Navigate to="/auth" replace /> // Redirect to /auth if not authenticated
            )
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/add-secret"
          element={
            isAuthenticated ? (
              <AddSecret /> // Render AddSecret component if authenticated
            ) : (
              <Navigate to="/auth" replace /> // Redirect to /auth if not authenticated
            )
          }
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <App /> // Fallback to App if authenticated
            ) : (
              <Navigate to="/auth" replace /> // Redirect to /auth if not authenticated
            )
          }
        />
      </Routes>
    </Router>
  </StrictMode>
);