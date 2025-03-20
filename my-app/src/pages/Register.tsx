import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register: React.FC = () => {
  const [fullnavn, setFullnavn] = useState("");
  const [e_post, setEPost] = useState("");
  const [passord, setPassord] = useState("");
  const [telefon, setTelefon] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/create_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          fullnavn: fullnavn.trim(), 
          e_post: e_post.trim(), 
          passord, 
          telefon: telefon.trim() 
        }),
      });

      const text = await response.text();
      console.log("Raw Response:", text); // Debugging

      if (!response.ok) {
        throw new Error(text || "Registration failed.");
      }

      const data = JSON.parse(text);
      console.log("Registration successful!", data);
      navigate("/"); // Redirect to login page
    } catch (err: any) {
      setError(err.message);
      console.error("Error registering:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="text" 
            placeholder="Full Name"
            value={fullnavn} 
            onChange={(e) => setFullnavn(e.target.value)} 
            required 
          />
        </div>
        <div>
          <input 
            type="email" 
            placeholder="Email"
            value={e_post} 
            onChange={(e) => setEPost(e.target.value)} 
            required 
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="Password"
            value={passord} 
            onChange={(e) => setPassord(e.target.value)} 
            required 
          />
        </div>
        <div>
          <input 
            type="text" 
            placeholder="Phone Number"
            value={telefon} 
            onChange={(e) => setTelefon(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="signup-link">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Register;