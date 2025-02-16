import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await axios.get(`http://localhost:8080/auth/google?code=${code}`);
          const token = response.data;

          // Store the JWT token
          localStorage.setItem("token", token);

          // Redirect to dashboard
          navigate("/dashboard");
        } catch (error: any) {
          console.error("Authentication failed:", error);
          setError("Authentication failed. Please try again.");
          setTimeout(() => navigate("/login"), 3000);
        }
      } else {
        setError("No authentication code received");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <div className="mt-4 text-gray-600">Processing your login...</div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
