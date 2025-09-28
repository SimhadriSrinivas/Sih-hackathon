// src/pages/users/usergraf.jsx
import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { databases } from "../../lib/appwrite"; // ✅ Appwrite SDK
import { ID } from "appwrite"; // ✅ For unique document IDs
import { Query } from "appwrite"; // Import Query for advanced queries

const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const reviewCollectionId = import.meta.env.VITE_APPWRITE_USERREVIEW_ID;
const clinicCollectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function UserGraf() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [textReview, setTextReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [selectedClinicId, setSelectedClinicId] = useState("");

  // Fetch past reviews from Appwrite
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await databases.listDocuments(dbId, reviewCollectionId);
        setReviews(
          res.documents.map((doc) => ({
            stars: doc.overall_rating,
            text: doc.review,
            clinicId: doc.clinicId,
            time: new Date(doc.$createdAt).toLocaleString(),
          }))
        );
      } catch (err) {
        console.error("❌ Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  // Fetch clinics
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await databases.listDocuments(dbId, clinicCollectionId, [
          Query.limit(100),
        ]); // Use the correct collection ID
        setClinics(res.documents);
      } catch (err) {
        console.error("❌ Error fetching clinics:", err);
      }
    };
    fetchClinics();
  }, []);

  // Submit review to Appwrite
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClinicId) {
      alert("Please select a clinic!");
      return;
    }
    if (rating > 0 && textReview.trim()) {
      try {
        const doc = await databases.createDocument(
          dbId,
          reviewCollectionId,
          ID.unique(),
          {
            clinicId: selectedClinicId,
            review: textReview,
            overall_rating: rating,
            theropy_rating: rating,
          }
        );

        // Update local state
        setReviews([
          ...reviews,
          {
            stars: doc.overall_rating,
            text: doc.review,
            time: new Date(doc.$createdAt).toLocaleString(),
          },
        ]);

        // Reset form
        setRating(0);
        setTextReview("");
        setSelectedClinicId("");
        alert("✅ Review submitted successfully!");
      } catch (err) {
        console.error("❌ Error submitting review:", err);
        alert("Failed to submit review.");
      }
    } else {
      alert("🌿 Please select a star rating and write a review!");
    }
  };

  // Chart data
  const data = {
    labels: reviews.map((r) => r.time),
    datasets: [
      {
        label: "Therapy Rating (Stars)",
        data: reviews.map((r) => r.stars),
        fill: false,
        borderColor: "#4CAF50",
        backgroundColor: "#FFD54F",
        tension: 0.3,
      },
    ],
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "2rem auto",
        padding: "2.5rem",
        background: "#F5F5DC",
        borderRadius: 16,
        boxShadow: "0 4px 18px rgba(76,175,80,0.15)",
        fontFamily: "'Segoe UI', sans-serif",
        border: "2px solid #C8E6C9",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#4CAF50",
          fontSize: "1.8rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          borderBottom: "3px solid #FFD54F",
          paddingBottom: "0.5rem",
        }}
      >
        🌿 Therapy Review & Progress
      </h2>

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        {/* Clinic Selection */}
        <select
          value={selectedClinicId}
          onChange={(e) => setSelectedClinicId(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.7rem",
            borderRadius: "8px",
            border: "1px solid #A5D6A7",
            fontSize: "1rem",
            background: "#F1F8E9",
            outline: "none",
            marginBottom: "1rem",
          }}
        >
          <option value="">Select Clinic</option>
          {clinics.map((clinic) => (
            <option key={clinic.$id} value={clinic.$id}>
              {clinic.clinic_name}
            </option>
          ))}
        </select>

        {/* Star Rating */}
        <div style={{ marginBottom: "1rem" }}>
          {[...Array(5)].map((star, i) => {
            const ratingValue = i + 1;
            return (
              <span
                key={i}
                onClick={() => setRating(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                style={{
                  fontSize: "2.2rem",
                  cursor: "pointer",
                  color:
                    ratingValue <= (hover || rating) ? "#FFD54F" : "#D7CCC8",
                  transition: "color 0.2s ease",
                }}
              >
                ★
              </span>
            );
          })}
        </div>

        {/* Textbox for review */}
        <textarea
          value={textReview}
          onChange={(e) => setTextReview(e.target.value)}
          placeholder="🪔 Share your therapy experience..."
          style={{
            width: "100%",
            minHeight: "90px",
            padding: "0.9rem",
            borderRadius: "10px",
            border: "1px solid #A5D6A7",
            marginBottom: "1rem",
            fontSize: "1rem",
            background: "#F1F8E9",
            outline: "none",
          }}
          required
        />

        <button
          type="submit"
          style={{
            padding: "0.7rem 2rem",
            borderRadius: "10px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1.05rem",
            boxShadow: "0 3px 10px rgba(76,175,80,0.25)",
            transition: "all 0.2s ease",
          }}
        >
          Submit Review
        </button>
      </form>

      {/* Chart */}
      {reviews.length > 0 && (
        <Line
          data={data}
          options={{
            responsive: true,
            scales: {
              y: { min: 0, max: 5, ticks: { stepSize: 1 } },
            },
            plugins: {
              legend: { position: "top", labels: { color: "#4E342E" } },
              title: {
                display: true,
                text: "🌸 Therapy Ratings Over Time",
                color: "#8D6E63",
                font: { size: 16, weight: "bold" },
              },
            },
          }}
        />
      )}

      {/* Show past reviews */}
      {reviews.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3
            style={{
              color: "#8D6E63",
              marginBottom: "1rem",
              borderBottom: "2px solid #FFD54F",
              paddingBottom: "0.3rem",
            }}
          >
            🧘 Past Reviews
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {reviews.map((r, i) => (
              <li
                key={i}
                style={{
                  background: "#F1F8E9",
                  margin: "0.6rem 0",
                  padding: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #C8E6C9",
                }}
              >
                <strong style={{ color: "#4CAF50" }}>
                  {"⭐".repeat(r.stars)} ({r.stars}/5)
                </strong>
                <p style={{ margin: "0.5rem 0", color: "#4E342E" }}>{r.text}</p>
                <small style={{ color: "#6D4C41" }}>{r.time}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
