// src/pages/clinics/ClinicSignup.jsx
import React, { useState, useEffect } from "react";
import { databases, ID, account } from "../../lib/appwrite";
import DoctorDashboard from "./doctordashbord";

export default function ClinicSignup() {
  const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(true); // while checking session

  // 🌿 Ayurvedic Inspired Styles
  const containerStyle = {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2.5rem",
    background: "#FAF3E0",
    borderRadius: "16px",
    border: "2px solid #C8E6C9",
    boxShadow: "0 6px 18px rgba(76,175,80,0.15)",
    fontFamily: "'Segoe UI', sans-serif",
  };

  const headingStyle = {
    textAlign: "center",
    color: "#2E7D32",
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    fontWeight: "bold",
    borderBottom: "3px solid #FFD54F",
    paddingBottom: "0.5rem",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
    color: "#4E342E",
  };

  const inputStyle = {
    padding: "0.7rem",
    borderRadius: "8px",
    border: "1px solid #A5D6A7",
    marginBottom: "1rem",
    width: "100%",
    fontSize: "1rem",
    background: "#F1F8E9",
    outline: "none",
  };

  const buttonStyle = {
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    border: "none",
    background: "#388E3C",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: "0.5rem",
    marginBottom: "0.5rem",
    transition: "all 0.2s ease",
  };

  const listStyle = {
    listStyle: "none",
    padding: 0,
    marginTop: "1rem",
  };

  const liStyle = {
    background: "#FFFDE7",
    borderRadius: "8px",
    padding: "0.7rem",
    marginBottom: "0.5rem",
    border: "1px solid #FFD54F",
    color: "#6D4C41",
    fontWeight: "500",
  };

  const [clinicName, setClinicName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [therapies, setTherapies] = useState([]);
  const [newTherapy, setNewTherapy] = useState("");
  const [doctorSlots, setDoctorSlots] = useState("");
  const [slotsList, setSlotsList] = useState([]);

  // ✅ Check if user already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const session = await account.get();
        if (session) {
          console.log("User logged in:", session);
          setShowDashboard(true);
        }
      } catch (err) {
        console.log("No active session:", err.message);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  // Ask for device location 🌍
  useEffect(() => {
    if (locationPermission === null && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setLocationPermission(true);
        },
        () => setLocationPermission(false)
      );
    }
  }, [locationPermission]);

  const addTherapy = () => {
    if (newTherapy.trim()) {
      setTherapies([...therapies, newTherapy.trim()]);
      setNewTherapy("");
    }
  };

  const addSlot = () => {
    const slotsArr = doctorSlots
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setSlotsList([...slotsList, ...slotsArr]);
    setDoctorSlots("");
  };

  // 🔥 Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !clinicName.trim() ||
      !location.trim() ||
      !mobileNumber.trim() ||
      therapies.length === 0 ||
      slotsList.length === 0 ||
      !coords
    ) {
      alert(
        "Please fill all required fields, add at least one therapy and slot, and allow location access."
      );
      return;
    }

    if (mobileNumber.length < 1 || mobileNumber.length > 20) {
      alert("Mobile number must be 1-20 characters.");
      return;
    }

    try {
      // Create a boolean map for available-timeslots
      const availableTimeSlots = {};
      slotsList.forEach((slot) => {
        availableTimeSlots[slot] = true;
      });

      const payload = {
        clinic_name: clinicName,
        location: location,
        latitude: coords.latitude,
        longitude: coords.longitude,
        "time-slots": slotsList,
        "available-timeslots": availableTimeSlots,
        therapy: therapies,
        "clinic-mobilenumber": mobileNumber,
      };

      const res = await databases.createDocument(
        dbId,
        collectionId,
        ID.unique(),
        payload
      );

      if (res && res.$id) {
        window.localStorage.setItem("clinicId", res.$id);
      }

      console.log("Clinic saved:", res);
      alert("🌿 Clinic signup successful!");
      setClinicName("");
      setMobileNumber("");
      setLocation("");
      setTherapies([]);
      setSlotsList([]);
      setCoords(null);
      setLocationPermission(null);
      setNewTherapy("");
      setDoctorSlots("");
      setShowDashboard(true);
    } catch (err) {
      console.error("Error saving clinic:", err);
      alert("⚠️ Failed to save clinic. " + (err?.message || ""));
    }
  }

  // ⏳ Loading state while checking session
  if (loading) {
    return <div>Checking session...</div>;
  }

  if (showDashboard) {
    return <DoctorDashboard />;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🌸 Ayurvedic Clinic Signup</h2>

      {coords && (
        <div
          style={{
            marginBottom: "1rem",
            color: "#2E7D32",
            fontWeight: "500",
            background: "#E8F5E9",
            padding: "0.6rem",
            borderRadius: "6px",
          }}
        >
          📍 Location: {coords.latitude?.toFixed(5)},{" "}
          {coords.longitude?.toFixed(5)}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>🏥 Clinic Name</label>
          <input
            type="text"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            style={inputStyle}
            placeholder="Enter your clinic name"
            required
          />
        </div>
        <div>
          <label style={labelStyle}>📱 Mobile Number</label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            style={inputStyle}
            placeholder="Enter your mobile number"
            required
          />
        </div>

        <div>
          <label style={labelStyle}>📌 Address</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
            placeholder="Enter clinic address"
          />
        </div>

        <div>
          <label style={labelStyle}>🌿 Therapies Offered</label>
          <input
            type="text"
            value={newTherapy}
            onChange={(e) => setNewTherapy(e.target.value)}
            style={inputStyle}
            placeholder="Add therapy (e.g., Abhyanga)"
          />
          <button type="button" onClick={addTherapy} style={buttonStyle}>
            ➕ Add
          </button>
          <ul style={listStyle}>
            {therapies.map((t, i) => (
              <li key={i} style={liStyle}>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label style={labelStyle}>🧑‍⚕️ Doctor Slots (comma separated)</label>
          <input
            type="text"
            value={doctorSlots}
            onChange={(e) => setDoctorSlots(e.target.value)}
            style={inputStyle}
            placeholder="e.g. 10:00 AM - 12:00 PM, 2:00 PM - 5:00 PM"
          />
          <button type="button" onClick={addSlot} style={buttonStyle}>
            ➕ Add
          </button>
          <ul style={listStyle}>
            {slotsList.map((s, i) => (
              <li key={i} style={liStyle}>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          style={{
            ...buttonStyle,
            width: "100%",
            marginTop: "1rem",
            fontSize: "1.1rem",
            background: "#2E7D32",
          }}
        >
          ✅ Submit Clinic
        </button>
      </form>
    </div>
  );
}
