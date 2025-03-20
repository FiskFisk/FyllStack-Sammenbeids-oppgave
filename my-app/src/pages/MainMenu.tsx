import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true }); // 🔥 Allows session cookies for authentication
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <h2>Main Menu</h2>
      <p>Welcome to the main menu!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MainMenu;
