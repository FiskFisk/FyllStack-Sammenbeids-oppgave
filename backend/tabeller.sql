-- User table
CREATE TABLE bruker (
    brukerID INT AUTO_INCREMENT PRIMARY KEY,
    e_post VARCHAR(255) NOT NULL UNIQUE,
    passord VARCHAR(255) NOT NULL,
    fullnavn VARCHAR(200) NOT NULL,
    telefon VARCHAR(20) NOT NULL
);

-- Table for storing each quiz attempt
CREATE TABLE quizResult (
    resultID INT AUTO_INCREMENT PRIMARY KEY,
    brukerID INT NOT NULL,
    quizName VARCHAR(255) NOT NULL,
    totalScore INT DEFAULT 0,
    attemptDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brukerID) REFERENCES bruker(brukerID)
);

-- Table for storing the current quiz winner (highest score per quiz)
CREATE TABLE quizWinner (
    quizName VARCHAR(255) PRIMARY KEY,
    winnerBrukerID INT NOT NULL,
    winnerName VARCHAR(255) NOT NULL,
    highScore INT DEFAULT 0,
    lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (winnerBrukerID) REFERENCES bruker(brukerID)
);



  

