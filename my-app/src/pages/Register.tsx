import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // Import the CSS file

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/register", { username, email, password });
      console.log("Registration successful:", response.data);
      navigate("/"); // Redirect to login after successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Error registering:", err);
    }
  };

  return (
    <div className="signup-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="text" 
            placeholder="Username"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className="signup-link">Already have an account? <a href="/">Login</a></p>
    </div>
  );
};

export default Register;
