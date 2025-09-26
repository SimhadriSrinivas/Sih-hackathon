// src/pages/users/settings.jsx
import React, { useState, useEffect } from "react";
import { account } from "../../lib/appwrite";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const navigate = useNavigate();

  // Fetch user details
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await account.get();
        setUsername(user.name || "");
        setEmail(user.email || "");
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    }
    fetchUser();
  }, []);

  const handleSave = () => {
    alert("✅ Settings saved successfully!");
  };

  const handleContactUs = () => {
    alert("📩 Contact us at: support@ayurveda.com");
  };

  // Back button handler
  const handleBack = () => {
    navigate("/usersignup"); // ✅ goes directly to UserSignup page
  };

  // --- Styles ---
  const containerStyle = {
    margin: "2rem auto",
    padding: "2.5rem",
    maxWidth: "500px",
    background: "#F5F5DC",
    borderRadius: "18px",
    boxShadow: "0 4px 20px rgba(76, 175, 80, 0.15)",
    fontFamily: "'Segoe UI', sans-serif",
    border: "2px solid #C8E6C9",
  };
  const headingStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
    color: "#4CAF50",
    textAlign: "center",
    borderBottom: "3px solid #FFD54F",
    paddingBottom: "0.5rem",
  };
  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "1.2rem 1.5rem",
    marginBottom: "1.5rem",
    border: "1px solid #E0E0E0",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  };
  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "#8D6E63",
    fontSize: "1.05rem",
  };
  const valueBoxStyle = {
    padding: "0.7rem 1rem",
    borderRadius: "8px",
    background: "#F1F8E9",
    border: "1px solid #C8E6C9",
    fontSize: "1.08rem",
    color: "#2E7D32",
    marginBottom: "1rem",
  };
  const selectStyle = {
    width: "100%",
    padding: "0.7rem",
    borderRadius: "8px",
    border: "1px solid #A5D6A7",
    fontSize: "1rem",
    background: "#F9FBE7",
    outline: "none",
  };
  const toggleRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.8rem 1rem",
    borderRadius: "10px",
    background: "#F1F8E9",
    border: "1px solid #C8E6C9",
    marginBottom: "1rem",
    fontSize: "1.05rem",
    color: "#4E342E",
    fontWeight: "500",
  };
  const buttonStyle = {
    background: "#4CAF50",
    color: "#fff",
    padding: "0.9rem 2rem",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(76, 175, 80, 0.25)",
    transition: "all 0.2s ease-in-out",
  };
  const buttonSecondary = {
    ...buttonStyle,
    background: "#FFD54F",
    color: "#4E342E",
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          marginBottom: "1.2rem",
          background: "#FFD54F",
          color: "#4E342E",
          border: "none",
          borderRadius: "8px",
          padding: "0.6rem 1.4rem",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(141,110,99,0.10)",
        }}
      >
        ← Back
      </button>
      <h2 style={headingStyle}>⚙️ Ayurveda Settings</h2>

      {/* User Info */}
      <div style={cardStyle}>
        <label style={labelStyle}>👤 Username</label>
        <div style={valueBoxStyle}>
          {username || <span style={{ color: "#888" }}>Loading...</span>}
        </div>

        <label style={labelStyle}>📧 Email</label>
        <div style={valueBoxStyle}>
          {email || <span style={{ color: "#888" }}>Loading...</span>}
        </div>
      </div>

      {/* Language */}
      <div style={cardStyle}>
        <label style={labelStyle}>🌐 Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={selectStyle}
        >
          <option>English</option>
          <option>हिन्दी</option>
          <option>తెలుగు</option>
          <option>தமிழ்</option>
          <option>मराठी</option>
        </select>
      </div>

      {/* Dark Mode */}
      <div style={toggleRowStyle}>
        🌙 Dark Mode
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>

      {/* Notifications */}
      <div style={toggleRowStyle}>
        🔔 Enable Notifications
        <input
          type="checkbox"
          checked={notifications}
          onChange={() => setNotifications(!notifications)}
        />
      </div>

      {/* Contact Us */}
      <div style={cardStyle}>
        <button style={buttonSecondary} onClick={handleContactUs}>
          📩 Contact Us
        </button>
      </div>

      {/* Save Button */}
      <div style={{ textAlign: "center" }}>
        <button style={buttonStyle} onClick={handleSave}>
          💾 Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
