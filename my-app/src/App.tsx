import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Make sure to import your CSS file

function App() {
  const [message, setMessage] = useState("Loading..."); // Set a default message

  useEffect(() => {
    axios.get("http://localhost:5000/api/test") // Change to your backend IP if needed
      .then(response => setMessage(response.data.message))
      .catch(error => {
        console.error("Error fetching data:", error);
        setMessage("Failed to fetch message."); // Set error message
      });
  }, []);

  return (
    <div className="app-container">
      <h1>React + Flask</h1>
      <div className="message-box">
        <p>Backend says: {message}</p>
      </div>
    </div>
  );
}

export default App;
