import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Auth.css";

const Auth = ({ defaultIsLogin = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Update isLogin state when route changes
  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location.pathname]);

  const API_BASE_URL = "https://leetlink-theta.vercel.app"; // Change this to your Spring Boot backend URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation (only for register)
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setMessage(null);

      try {
        const endpoint = isLogin ? "/login" : "/register";
        const requestBody = {
          email: formData.email,
          password: formData.password,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        if (isLogin) {
          // Save token to localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("email", data.email);
          setMessage({ type: "success", text: "Login successful!" });

          // Redirect to dashboard
          navigate("/dashboard");
        } else {
          setMessage({ type: "success", text: "Registration successful! You can now log in." });
          // Redirect to login page after successful registration
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }

        // Reset form after successful submission
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        setMessage({ type: "error", text: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    navigate(newMode ? "/login" : "/register");
    setErrors({});
    setMessage(null);
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {message && <div className={`message ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? "error" : ""} disabled={isLoading} />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={errors.password ? "error" : ""} disabled={isLoading} />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "error" : ""} disabled={isLoading} />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="toggle-mode">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" className="toggle-btn" onClick={toggleMode} disabled={isLoading}>
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
