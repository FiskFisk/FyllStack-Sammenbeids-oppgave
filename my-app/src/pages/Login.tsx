import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { e_post: email.trim(), passord: password.trim() },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Login successful:", response.data);
      navigate(response.data.redirect || "/main-menu");
    } catch (err: any) {
      console.error("Error logging in:", err);
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn">Login</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div style={{ display: "flex", flexDirection: "row", gap: "8px", justifyContent: "center" }}>
        <p>Don't have an account?</p>
        <p className="signup-link">
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
