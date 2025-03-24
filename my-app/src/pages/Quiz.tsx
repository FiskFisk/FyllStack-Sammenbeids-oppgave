// src/pages/Quiz.tsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Quiz.css"; // Ensure to import the CSS file

interface Question {
  question_text: string;
  options: string[];
  correct_answer: string;
}

interface Quizzes {
  name: string;
  questions: Question[];
}

const Quiz: React.FC = () => {
  const { quizName } = useParams<{ quizName: string }>();
  const [quiz, setQuiz] = useState<Quizzes | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // Timer state

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/quizzes.json");
        const quizzes: Quizzes[] = response.data.quizzes;
        const foundQuiz = quizzes.find(q => q.name === quizName);
        setQuiz(foundQuiz || null);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizName]);

  useEffect(() => {
    // Timer logic
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer); // Clean up the interval on unmount
    } else {
      handleNextQuestion(); // Automatically go to the next question when time is up
    }
  }, [timeLeft]);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === quiz?.questions[currentQuestionIndex].correct_answer) {
      setScore(score + 100); // Award 100 points for a correct answer
    }
    setTimeout(handleNextQuestion, 500); // Wait for 500ms before going to the next question
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setTimeLeft(60); // Reset timer for the next question
  };

  const handleFinishQuiz = () => {
    setShowScoreboard(true);
  };

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  if (currentQuestionIndex >= quiz.questions.length) {
    return (
      <div>
        <h1>{quiz.name} Completed!</h1>
        <p>Your score: {score} points</p>
        <button onClick={handleFinishQuiz} className="next-button">
          View Scoreboard
        </button>
        {showScoreboard && (
          <div className="scoreboard">
            <h2>Scoreboard</h2>
            <p>Your Score: {score} points</p>
            <h3>Top 10 Scores</h3>
            <ul>
              {/* Placeholder for top scores; replace with actual data when available */}
              <li>1. User A - 300 points</li>
              <li>2. User B - 250 points</li>
              <li>3. User C - 200 points</li>
              <li>4. User D - 150 points</li>
              <li>5. User E - 100 points</li>
              <li>6. User F - 100 points</li>
              <li>7. User G - 50 points</li>
              <li>8. User H - 50 points</li>
              <li>9. User I - 0 points</li>
              <li>10. User J - 0 points</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="quiz">
      <h1>{currentQuestion.question_text}</h1>
      <div className="image-container">
        <img src="placeholder-image-url.jpg" alt="Quiz" className="quiz-image" />
      </div>
      <div className="timer">Time Left: {timeLeft}s</div> {/* Timer display */}
      <div className="options">
        <div className="answer-row">
          <button
            onClick={() => handleAnswerSelection(currentQuestion.options[0])}
            className={`quiz-button ${selectedAnswer === currentQuestion.options[0] ? "selected" : ""} top-left`}
          >
            {currentQuestion.options[0]}
          </button>
          <button
            onClick={() => handleAnswerSelection(currentQuestion.options[1])}
            className={`quiz-button ${selectedAnswer === currentQuestion.options[1] ? "selected" : ""} top-right`}
          >
            {currentQuestion.options[1]}
          </button>
        </div>
        <div className="answer-row">
          <button
            onClick={() => handleAnswerSelection(currentQuestion.options[2])}
            className={`quiz-button ${selectedAnswer === currentQuestion.options[2] ? "selected" : ""} bottom-left`}
          >
            {currentQuestion.options[2]}
          </button>
          <button
            onClick={() => handleAnswerSelection(currentQuestion.options[3])}
            className={`quiz-button ${selectedAnswer === currentQuestion.options[3] ? "selected" : ""} bottom-right`}
          >
            {currentQuestion.options[3]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
