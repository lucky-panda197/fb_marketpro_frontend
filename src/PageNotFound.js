import React from "react";
import { useNavigate } from "react-router-dom";
import "./PageNotFound.css"; // Import your CSS for styling

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-not-found-container">
      <img
        src="/404-cartoon-logo.webp"
        alt="Fashion Brand Logo"
        className="logo"
      />
      <h1 className="error-code">404</h1>
      <p className="error-message">
        Sorry, the page you're looking for isn't here.
      </p>
      <button onClick={() => navigate("/")} className="home-button">
        Back to Home
      </button>
    </div>
  );
};

export default PageNotFound;
