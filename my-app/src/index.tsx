import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the App component
import './index.css'; // Import global CSS styles if you have any

const rootElement = document.getElementById('root'); // Get the root element

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create a root
  root.render(
    <React.StrictMode>
      <App /> {/* Render the App component */}
    </React.StrictMode>
  );
}
