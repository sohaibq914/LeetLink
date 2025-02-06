import "./App.css";

import React, { useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "/auth/login" : "/auth/register";

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      // Redirect or update UI state here
      console.log("Success:", data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="App">
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isLogin ? "Login" : "Register"}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required={!isLogin} />
              </div>
            )}
            <div className="form-group">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="submit-button">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
          <p className="toggle-form">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
