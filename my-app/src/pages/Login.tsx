import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login: React.FC = () => {
  const [e_post, setEPost] = useState("");
  const [passord, setPassord] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { e_post, passord },
        { withCredentials: true } // 🔥 Allows session cookies for authentication
      );

      console.log("Login successful:", response.data);
      navigate(response.data.redirect || "/main-menu"); // 🔥 Fallback redirect
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
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
            value={e_post} 
            onChange={(e) => setEPost(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={passord} 
            onChange={(e) => setPassord(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="signup-redirect">
        Don't have an account? <Link to="/register" className="signup-link">Register</Link>
      </p>
    </div>
  );
};

export default Login;
