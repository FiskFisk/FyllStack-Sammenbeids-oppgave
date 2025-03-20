import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register: React.FC = () => {
  const [fullnavn, setFullnavn] = useState("");
  const [e_post, setEPost] = useState("");
  const [passord, setPassord] = useState("");
  const [telefon, setTelefon] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
 const response = await fetch("/create_user", { // Change to relative path
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ fullnavn, e_post, passord, telefon }),
});


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed. Please try again.");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      navigate("/"); // Redirect to login page
    } catch (err: any) {
      setError(err.message);
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
        <button type="submit" className="btn">Register</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p className="signup-link">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
};

export default Register;
