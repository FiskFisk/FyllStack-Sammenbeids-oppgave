import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Login.css'; // Import the CSS file

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/login", { email, password });
      console.log("Login successful:", response.data);
      navigate("/main-menu"); // Redirect to main menu after successful login
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Error logging in:", err);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="signup-redirect">
        <p>Don't have an account? <a href="/register" className="signup-link">Register</a></p>
      </div>
    </div>
  );
};

export default Login;
