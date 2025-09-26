// src/pages/doctors/DoctorDashboard.jsx
import React, { useEffect, useState } from "react";
import { databases } from "../../lib/appwrite";
import { Query } from "appwrite";

const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const clinicCollectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const appointmentCollectionId = import.meta.env
  .VITE_APPWRITE_APPOINTMENT_COLLECTION_ID;
const reviewCollectionId = import.meta.env.VITE_APPWRITE_USERREVIEW_ID;

function getClinicId() {
  return window.localStorage.getItem("clinicId") || "";
}

export default function DoctorDashboard(props) {
  const clinicId = props.clinicId || getClinicId();

  const [clinic, setClinic] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]); // just array of slots
  const [selectedSlots, setSelectedSlots] = useState([]); // store red slots
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch clinic details
  const fetchClinic = async () => {
    try {
      if (!clinicId) return;
      if (!clinicCollectionId) throw new Error("Missing clinic collectionId");

      const clinicDoc = await databases.getDocument(
        dbId,
        clinicCollectionId,
        clinicId
      );
      setClinic(clinicDoc);
      setTimeSlots(clinicDoc["time-slots"] || []);
    } catch (err) {
      console.error("❌ Error fetching clinic details:", err);
    }
  };

  // ✅ Fetch appointments
  const fetchAppointments = async () => {
    try {
      if (!clinicId) return;
      if (!appointmentCollectionId)
        throw new Error("Missing appointment collectionId");

      const res = await databases.listDocuments(dbId, appointmentCollectionId, [
        Query.equal("clinicId", clinicId),
      ]);
      setAppointments(res.documents);
    } catch (err) {
      console.error("❌ Error fetching appointments:", err);
    }
  };

  // ✅ Fetch reviews
  const fetchReviews = async () => {
    try {
      if (!clinicId) return;
      if (!reviewCollectionId) throw new Error("Missing review collectionId");

      const res = await databases.listDocuments(dbId, reviewCollectionId, [
        Query.equal("clinicId", clinicId),
      ]);
      setReviews(res.documents);
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    }
  };

  // ✅ Toggle slot selection (green ↔ red)
  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  useEffect(() => {
    if (!clinicId) {
      console.error("⚠️ No clinicId provided to DoctorDashboard.");
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchClinic(), fetchAppointments(), fetchReviews()]);
      setLoading(false);
    };
    fetchData();
  }, [clinicId]);

  // ✅ Style
  const slotButtonStyle = (slot) => ({
    padding: "0.8rem 1.2rem",
    margin: "0.5rem",
    borderRadius: "10px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    background: selectedSlots.includes(slot) ? "#C62828" : "#2E7D32", // red if selected else green
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "all 0.2s ease",
  });

  return (
    <div style={{ maxWidth: "900px", margin: "2rem auto", padding: "1.5rem" }}>
      {/* Navbar */}
      <nav
        style={{
          width: "100%",
          background: "#2E7D32",
          color: "#fff",
          padding: "1rem 2rem",
          borderRadius: "10px",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "1.3rem" }}>
          AyurSutra Doctor Dashboard
        </span>
        <button
          style={{
            background: "#fff",
            color: "#2E7D32",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => (window.location.href = "/clinics/signup")}
        >
          Back
        </button>
      </nav>

      {loading ? (
        <p style={{ color: "#8D6E63" }}>⏳ Loading...</p>
      ) : (
        <>
          {/* Clinic Details */}
          {clinic && (
            <div
              style={{
                background: "#F1F8E9",
                borderRadius: "10px",
                padding: "1.5rem",
                marginBottom: "2rem",
                boxShadow: "0 2px 8px rgba(46,125,50,0.07)",
              }}
            >
              <h3 style={{ color: "#2E7D32", marginBottom: "0.7rem" }}>
                {clinic.clinic_name}
              </h3>
              <div style={{ color: "#4E342E", marginBottom: "0.5rem" }}>
                📱 Mobile: {clinic["clinic-mobilenumber"]}
              </div>
              <div style={{ color: "#4E342E", marginBottom: "0.5rem" }}>
                📌 Address: {clinic.location}
              </div>
              <div style={{ color: "#4E342E", marginBottom: "0.5rem" }}>
                🌍 Lat: {clinic.latitude}, Lng: {clinic.longitude}
              </div>
              <div style={{ color: "#4E342E", marginBottom: "0.5rem" }}>
                🌿 Therapies: {clinic.therapy?.join(", ")}
              </div>
            </div>
          )}

          {/* Manage Slots */}
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#2E7D32", marginBottom: "1rem" }}>
              Manage Time Slots
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {timeSlots.length === 0 ? (
                <p style={{ color: "#8D6E63" }}>No slots available.</p>
              ) : (
                timeSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    style={slotButtonStyle(slot)}
                    onClick={() => toggleSlot(slot)}
                  >
                    {slot}
                  </button>
                ))
              )}
            </div>
            <button
              onClick={() => {
                const newSlot = window.prompt("Enter new slot (e.g. 10:00 AM)");
                if (newSlot) {
                  setTimeSlots([...timeSlots, newSlot]);
                }
              }}
              style={{
                marginTop: "1rem",
                padding: "0.7rem 1.5rem",
                borderRadius: "8px",
                background: "#1565C0",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              ➕ Add Slot
            </button>
          </section>

          {/* Appointments */}
          <section>
            <h3 style={{ color: "#2E7D32", marginBottom: "1rem" }}>
              Appointments
            </h3>
            {appointments.length === 0 ? (
              <p style={{ color: "#8D6E63" }}>No appointments yet.</p>
            ) : (
              <ul>
                {appointments.map((appt) => (
                  <li key={appt.$id}>
                    <strong>{appt.userName}</strong> – {appt.slot} – {appt.date}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Reviews */}
          <section style={{ marginTop: "2rem" }}>
            <h3 style={{ color: "#2E7D32", marginBottom: "1rem" }}>Reviews</h3>
            {reviews.length === 0 ? (
              <p style={{ color: "#8D6E63" }}>No reviews yet.</p>
            ) : (
              <ul>
                {reviews.map((rev) => (
                  <li key={rev.$id}>
                    <strong>{rev.userName}</strong>: {rev.comment} ⭐
                    {rev.rating}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
