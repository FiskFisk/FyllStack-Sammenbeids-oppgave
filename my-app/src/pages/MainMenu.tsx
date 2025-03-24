// src/pages/MainMenu.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MainMenu.css";

interface Question {
  question_text: string;
  options: string[];
  correct_answer: string;
}

interface Quiz {
  name: string;
  Category: string; // Changed to match your JSON structure
  questions: Question[];
}

interface Quizzes {
  quizzes: Quiz[];
}

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [fullName, setFullName] = useState<string | null>(null); // State for full name

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user/details", { withCredentials: true });
        setFullName(response.data.fullnavn); // Set the full name from the response
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      setFullName(null); // Clear full name on logout
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handlePlayQuiz = (quizName: string) => {
    navigate(`/quiz/${quizName}`); // Navigate to the selected quiz
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/quizzes.json");
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizzes();
  }, []);

  // Group quizzes by category
  const categories = quizzes.reduce((acc: { [key: string]: Quiz[] }, quiz) => {
    if (!acc[quiz.Category]) {
      acc[quiz.Category] = [];
    }
    acc[quiz.Category].push(quiz);
    return acc;
  }, {});

  return (
    <div className="main-menu">
      <header className="header">
        <div className="logo-box">
          <div className="logo" />
        </div>
        {/* Display Full Name on the Right Side of the Header */}
        <div className="user-info">
          {fullName ? (
            <p className="user-name">{fullName}</p>
          ) : (
            <p className="user-name">Welcome!</p> // Fallback message if full name is not set
          )}
        </div>
      </header>

      <div className="content">
        {/* Banner Section */}
        <div className="banner">
          <h1 className="quiz-title">Quiz</h1>
          <button className="play-btn" onClick={() => handlePlayQuiz("Animal Quiz")}>Play</button>
        </div>

        {/* Categories */}
        <h2 className="section-title">CATEGORIES</h2>
        <div className="categories">
          {Object.keys(categories).map(category => (
            <div key={category} className="category-circle">
              {category}
            </div>
          ))}
        </div>

        {/* Quiz Sections */}
        <div className="quiz-section">
          {Object.entries(categories).map(([categoryName, quizzes]) => (
            <div key={categoryName}>
              <h2 className="section-title">{categoryName}</h2>
              <div className="quiz-boxes">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.name}
                    className="quiz-box"
                    onClick={() => handlePlayQuiz(quiz.name)}
                  >
                    {quiz.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
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
