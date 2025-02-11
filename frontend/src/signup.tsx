import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios

const Signup: React.FC = () => {
  const [err, setErr] = useState<string>("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    try {
      const response = await axios.post("http://localhost:8080/signup", {
        username,
        email,
        password,
      });

      // Redirect to login page after successful signup
      navigate("/login");
    } catch (error: any) {
      setErr(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
};

export default Signup;
