import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainMenu.css";

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="main-menu">
      <header className="header">
        {/* Logo Section */}
        <div className="logo-box">
          <div className="logo" />
        </div>
      </header>

      <div className="content">
        {/* Banner Section */}
        <div className="banner">
          <h1 className="quiz-title">Quiz</h1>
          <button className="play-btn">Play</button>
        </div>

        {/* Categories */}
        <h2 className="section-title">CATEGORIES</h2>
        <div className="categories">
          <div className="category-circle">Category 1</div>
          <div className="category-circle">Category 2</div>
          <div className="category-circle">Category 3</div>
          <div className="category-circle">Category 4</div>
        </div>

        {/* Quiz Sections */}
        <div className="quiz-section">
          <h2 className="section-title">CATEGORY 1</h2>
          <div className="quiz-boxes">
            <div className="quiz-box">Quiz 1</div>
            <div className="quiz-box">Quiz 2</div>
            <div className="quiz-box">Quiz 3</div>
            <div className="quiz-box">Quiz 4</div>
          </div>

          <h2 className="section-title">CATEGORY 2</h2>
          <div className="quiz-boxes">
            <div className="quiz-box">Quiz 5</div>
            <div className="quiz-box">Quiz 6</div>
            <div className="quiz-box">Quiz 7</div>
            <div className="quiz-box">Quiz 8</div>
          </div>

          <h2 className="section-title">CATEGORY 3</h2>
          <div className="quiz-boxes">
            <div className="quiz-box">Quiz 9</div>
            <div className="quiz-box">Quiz 10</div>
            <div className="quiz-box">Quiz 11</div>
            <div className="quiz-box">Quiz 12</div>
          </div>
        </div>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-logo-box">
          <div className="footer-logo" />
        </div>
        <p>© 2025 Hvahoot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainMenu;
