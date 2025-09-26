import React from "react";

const Notifications = ({ notifications }) => {
  // Back button handler
  const handleBack = () => {
    window.history.back();
  };
  return (
    <div
      style={{
        maxWidth: 640,
        margin: "2rem auto",
        padding: "2.5rem",
        background: "#FAF3E0", // soft ayurvedic beige
        borderRadius: 16,
        border: "2px solid #C8E6C9", // herbal border
        boxShadow: "0 6px 20px rgba(76,175,80,0.15)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
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
      {/* Title */}
      <h2
        style={{
          color: "#2E7D32", // deep green
          textAlign: "center",
          marginBottom: "1.8rem",
          fontSize: "1.8rem",
          fontWeight: "bold",
          borderBottom: "3px solid #FFD54F", // golden divider
          paddingBottom: "0.5rem",
        }}
      >
        🔔 Ayurvedic Notifications
      </h2>

      {/* Notifications List */}
      {notifications && notifications.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((n, i) => (
            <li
              key={i}
              style={{
                background: "#F1F8E9", // light herbal green
                borderRadius: 12,
                padding: "1.2rem",
                marginBottom: "1rem",
                border: "1px solid #A5D6A7",
                boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🌿</span>
              <div style={{ color: "#4E342E" }}>
                <b style={{ color: "#388E3C" }}>{n.therapy}</b> booked at{" "}
                <b style={{ color: "#6D4C41" }}>{n.slot}</b> in{" "}
                <b style={{ color: "#8D6E63" }}>{n.clinic}</b>.
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{
            color: "#6D4C41",
            textAlign: "center",
            background: "#FFF8E1", // soft golden background
            padding: "1rem",
            borderRadius: 10,
            border: "1px dashed #FFD54F",
          }}
        >
          🌱 No notifications yet. Stay tuned!
        </div>
      )}
    </div>
  );
};

export default Notifications;
