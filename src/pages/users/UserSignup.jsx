// src/pages/users/usersignup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Settings from "./settings";
import UserGraf from "./usergraf";
import Notifications from "./notifications";
import MyTheropies from "./mytheropies";
import { account, databases } from "../../lib/appwrite";
import { Query } from "appwrite";

const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

// Utility: distance calculator
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function UserSignup() {
  // --- State ---
  const [activePage, setActivePage] = useState("main");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [location, setLocation] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [nearby, setNearby] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  const navigate = useNavigate();

  // --- Booking logic ---
  async function handleBookSlot(slot, clinic, therapy) {
    try {
      let email = window.localStorage.getItem("user_email");
      if (!email) {
        email = window.prompt("Enter your Gmail to receive notifications:");
        if (!email) return alert("❌ Email is required!");
        window.localStorage.setItem("user_email", email);
      }

      // Build message
      const message = `
      📅 New Therapy Booking Details:
      ------------------------------
      🏥 Clinic: ${clinic.clinic_name}
      💆 Therapy: ${therapy}
      ⏰ Time Slot: ${slot}
      📧 User Email: ${email}
      `;

      // Call Web3Forms API
      const formData = new FormData();
      formData.append("access_key", "7f15197f-f24a-4eca-84e2-fe2d1e1c1666"); // 🔑 Replace with your Web3Forms Access Key
      formData.append("to", "bunnyroyal18@gmail.com"); // 📩 Replace with your email
      formData.append("subject", "New Therapy Booking");
      formData.append("message", message);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      // Save booking locally
      setNotificationList((prev) => [
        ...prev,
        { clinic: clinic.clinic_name, therapy, slot },
      ]);

      if (data.success) {
        alert(`✅ Booking confirmed! Email sent to ${email}`);
      } else {
        alert("⚠️ Booking saved, but email failed: " + data.message);
      }
    } catch (err) {
      alert("❌ Booking failed, try again.");
    }
  }

  // --- Location ---
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.warn("⚠️ Location not allowed")
      );
    }
  }, []);

  // --- Fetch clinics ---
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await databases.listDocuments(dbId, collectionId, [
          Query.limit(100),
        ]);
        setClinics(res.documents);
      } catch (err) {
        console.error("Error fetching clinics:", err);
      }
    };
    fetchClinics();
  }, []);

  // --- Nearby clinics ---
  useEffect(() => {
    if (location && clinics.length > 0) {
      const nearbyList = clinics.filter((c) => {
        if (!c.latitude || !c.longitude) return false;
        return (
          calculateDistance(
            location.lat,
            location.lng,
            c.latitude,
            c.longitude
          ) < 10
        );
      });
      setNearby(nearbyList);
    }
  }, [location, clinics]);

  // --- Colors ---
  const colors = {
    primary: "#2e7d32",
    secondary: "#8d6e63",
    lightBg: "#f4f1ea",
    cardBg: "#ffffff",
    highlight: "#a5d6a7",
    accent: "#c8e6c9",
  };

  // --- Styles ---
  const containerStyle = {
    marginTop: "5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "80vh",
    background: colors.lightBg,
    padding: "3rem 1rem",
  };

  const cardStyle = {
    background: colors.cardBg,
    borderRadius: "14px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    padding: "2.5rem",
    width: "90%",
    maxWidth: "1000px",
  };

  const headingStyle = {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    letterSpacing: "0.5px",
    borderBottom: `2px solid ${colors.accent}`,
    paddingBottom: "0.5rem",
  };

  const liStyle = {
    marginBottom: "1.5rem",
    padding: "1rem",
    border: `1px solid ${colors.accent}`,
    borderRadius: "8px",
    background: "#fafafa",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.2s",
  };

  const clinicNameStyle = {
    fontWeight: "bold",
    color: colors.secondary,
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
  };

  const slotBtnStyle = {
    background: colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.6rem 1.3rem",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    marginRight: "0.5rem",
    marginBottom: "0.5rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    transition: "background 0.2s",
  };

  const therapyLiStyle = (selected) => ({
    background: selected ? colors.highlight : "#fff",
    color: selected ? colors.primary : "#333",
    border: selected
      ? `2px solid ${colors.primary}`
      : `1px solid ${colors.accent}`,
    borderRadius: "8px",
    padding: "0.7rem 1rem",
    marginBottom: "0.7rem",
    cursor: "pointer",
    fontWeight: selected ? "bold" : "normal",
    boxShadow: selected ? "0 3px 8px rgba(46,125,50,0.2)" : "none",
    transition: "all 0.2s",
  });

  const navBarStyle = {
    position: "fixed",
    top: "4.2rem",
    left: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    zIndex: 100,
    background: colors.cardBg,
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
  };

  const navBtnStyle = {
    background: "#fff",
    border: `1px solid ${colors.primary}`,
    color: colors.primary,
    borderRadius: "10px",
    padding: "0.8rem 1.2rem",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.07)",
    transition: "background 0.2s, color 0.2s",
    textAlign: "left",
  };

  // --- Render ---
  return (
    <div>
      {/* 🌿 Top Navbar */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: colors.primary,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0.8rem 1rem",
          fontWeight: "bold",
          fontSize: "1.2rem",
          zIndex: 300,
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        {/* ☰ Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "1.8rem",
            marginRight: "1rem",
            color: "#fff",
          }}
        >
          ☰
        </button>
        <img
          src="/src/assets/SIH- FINAL LOGO.png"
          alt="AyurSutra Logo"
          style={{
            height: "42px",
            width: "42px",
            marginRight: "12px",
            borderRadius: "50%",
            objectFit: "cover",
            background: "#fff",
          }}
        />
        AyurSutra Panchakarma Software
      </header>

      {/* Sidebar */}
      {menuOpen && (
        <nav style={navBarStyle}>
          <button
            style={navBtnStyle}
            onClick={() => {
              setActivePage("settings");
              setMenuOpen(false);
            }}
          >
            ⚙️ Settings
          </button>
          <button
            style={navBtnStyle}
            onClick={() => {
              setActivePage("usergraf");
              setMenuOpen(false);
            }}
          >
            📈 UserGraf
          </button>
          <button
            style={navBtnStyle}
            onClick={() => {
              setActivePage("notifications");
              setMenuOpen(false);
            }}
          >
            🔔 Notifications
          </button>
          <button
            style={navBtnStyle}
            onClick={() => {
              setActivePage("mytheropies");
              setMenuOpen(false);
            }}
          >
            🧘 My Therapies
          </button>
          <button
            style={{ ...navBtnStyle, color: "#d32f2f", borderColor: "#d32f2f" }}
            onClick={async () => {
              try {
                await account.deleteSession("current");
              } catch {}
              window.localStorage.clear();
              navigate("/signin");
            }}
          >
            🚪 Sign Out
          </button>
        </nav>
      )}

      {/* Pages */}
      {activePage === "settings" && <Settings />}
      {activePage === "usergraf" && <UserGraf />}
      {activePage === "notifications" && (
        <Notifications notifications={notificationList} />
      )}
      {activePage === "mytheropies" && (
        <MyTheropies bookings={notificationList} />
      )}

      {/* Main Page */}
      {activePage === "main" && (
        <div style={containerStyle}>
          <div style={cardStyle}>
            {/* Clinics List */}
            <h2 style={headingStyle}>Nearby Ayurvedic Clinics 🌿</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {(nearby.length > 0 ? nearby : clinics).map((c) => (
                <li key={c.$id} style={liStyle}>
                  <div
                    onClick={() => {
                      setSelectedClinic(c);
                      setSelectedTherapy(null);
                    }}
                    style={clinicNameStyle}
                  >
                    {c.clinic_name}
                  </div>

                  {/* Expanded clinic */}
                  {selectedClinic?.$id === c.$id && (
                    <div
                      style={{
                        background: colors.accent,
                        borderRadius: "10px",
                        marginTop: "0.8rem",
                        padding: "1.5rem",
                      }}
                    >
                      <h4
                        style={{
                          ...headingStyle,
                          fontSize: "1.2rem",
                          color: colors.secondary,
                          borderBottom: "none",
                        }}
                      >
                        Therapies at {c.clinic_name}
                      </h4>
                      {/* Clinic Mobile Number */}
                      {c["clinic-mobilenumber"] && (
                        <div
                          style={{
                            marginBottom: "0.7rem",
                            color: colors.primary,
                            fontWeight: "bold",
                          }}
                        >
                          📞 Mobile: {c["clinic-mobilenumber"]}
                        </div>
                      )}
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {c.therapy?.map((t, i) => (
                          <li
                            key={i}
                            style={therapyLiStyle(selectedTherapy === t)}
                            onClick={() => setSelectedTherapy(t)}
                          >
                            {t}
                          </li>
                        ))}
                      </ul>

                      {/* Time Slots */}
                      {selectedTherapy && (
                        <div
                          style={{
                            marginTop: "1rem",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.6rem",
                          }}
                        >
                          {c["time-slots"]?.map((slot, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                handleBookSlot(slot, c, selectedTherapy)
                              }
                              style={slotBtnStyle}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Google Maps */}
                      {c.latitude && c.longitude && (
                        <div style={{ marginTop: "1.5rem" }}>
                          <h4
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "bold",
                              marginBottom: "0.5rem",
                              color: colors.primary,
                            }}
                          >
                            📍 Location
                          </h4>
                          <iframe
                            width="100%"
                            height="250"
                            style={{ border: "0", borderRadius: "10px" }}
                            loading="lazy"
                            allowFullScreen
                            src={`https://www.google.com/maps?q=${c.latitude},${c.longitude}&hl=es;z=14&output=embed`}
                          ></iframe>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}