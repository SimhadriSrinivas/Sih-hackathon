import React, { useState } from "react";

const therapyInfo = {
  Abhyanga:
    "A full body massage with warm herbal oils to promote relaxation and detoxification.",
  Shirodhara:
    "A therapy where warm oil is poured over the forehead to calm the mind and nervous system.",
  Swedana: "Herbal steam therapy to open pores and eliminate toxins.",
  Basti: "Medicated enema therapy for cleansing the colon.",
  Nasya:
    "Nasal administration of herbal oils to clear sinuses and improve breathing.",
  // Add more therapies and info as needed
};

const MyTheropies = ({ bookings }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [ratings, setRatings] = useState({});

  const handleSelect = (idx) => {
    setSelectedIdx(idx === selectedIdx ? null : idx);
  };

  const handleRating = (idx, value) => {
    setRatings({ ...ratings, [idx]: value });
  };

  // Back button handler
  const handleBack = () => {
    window.history.back();
  };
  return (
    <div
      style={{
        maxWidth: 650,
        margin: "2rem auto",
        padding: "2.5rem",
        background: "#FAF3E0", // Ayurvedic beige
        borderRadius: 16,
        border: "2px solid #C8E6C9", // soft herbal green border
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
      <h2
        style={{
          color: "#2E7D32", // deep herbal green
          textAlign: "center",
          marginBottom: "1.8rem",
          fontSize: "1.8rem",
          fontWeight: "bold",
          borderBottom: "3px solid #FFD54F", // golden divider
          paddingBottom: "0.5rem",
        }}
      >
        🌿 My Therapies
      </h2>

      {bookings && bookings.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {bookings.map((b, i) => (
            <li
              key={i}
              style={{
                background: "#F1F8E9", // light herbal green
                borderRadius: 12,
                padding: "1rem",
                marginBottom: "1rem",
                border: "1px solid #A5D6A7",
                boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
                transition: "transform 0.2s ease",
              }}
              onClick={() => handleSelect(i)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <b style={{ color: "#388E3C", fontSize: "1.2rem" }}>
                {b.therapy}
              </b>

              {selectedIdx === i && (
                <div
                  style={{
                    marginTop: "1rem",
                    background: "#FFFDE7", // soft yellow highlight
                    borderRadius: 10,
                    padding: "1rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    color: "#4E342E",
                    textAlign: "left",
                  }}
                >
                  <div style={{ marginBottom: "0.7rem" }}>
                    <b style={{ color: "#6D4C41" }}>About:</b>{" "}
                    {therapyInfo[b.therapy] || "No information available."}
                  </div>

                  {/* Rating Section */}
                  <div style={{ marginBottom: "0.7rem" }}>
                    <b style={{ color: "#6D4C41" }}>Rate this therapy:</b>
                    <span style={{ marginLeft: "0.5rem" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          style={{
                            fontSize: "1.8rem",
                            color: star <= ratings[i] ? "#FFD700" : "#ccc",
                            cursor: "pointer",
                            transition: "color 0.2s ease",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRating(i, star);
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </span>
                    {ratings[i] && (
                      <span
                        style={{
                          marginLeft: "0.7rem",
                          color: "#2E7D32",
                          fontWeight: "bold",
                        }}
                      >
                        ({ratings[i]} stars)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{
            color: "#6D4C41",
            textAlign: "center",
            background: "#FFF8E1",
            padding: "1rem",
            borderRadius: 10,
            border: "1px dashed #FFD54F",
          }}
        >
          🌱 No therapies booked yet.
        </div>
      )}
    </div>
  );
};

export default MyTheropies;
