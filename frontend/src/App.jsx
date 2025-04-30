import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Auth from "./pages/Auth";

// Import your other components
import Dashboard from "./pages/Dashboard";
// import Profile from './components/Profile';
// import NotFound from './components/NotFound';

// Example NotFound component
const NotFound = () => (
  <div className="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

// Protected route wrapper
const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Login/Register page wrapper
const AuthPage = ({ isLogin }) => {
  return <Auth defaultIsLogin={isLogin} />;
};

// Create router
const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <AuthPage isLogin={true} />,
  },
  {
    path: "/register",
    element: <AuthPage isLogin={false} />,
  },

  // Protected routes
  {
    path: "/",
    element: <ProtectedRoute />, // requires token
    children: [
      {
        index: true, // this is the same as path: "/"
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <div>Profile Page</div>,
      },
    ],
  },

  // Catch-all for 404
  {
    path: "*",
    element: <NotFound />,
  },
]);

// Main App component
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
