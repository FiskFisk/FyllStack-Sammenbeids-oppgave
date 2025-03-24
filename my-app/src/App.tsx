import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainMenu from "./pages/MainMenu";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/quiz/:quizName" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;
