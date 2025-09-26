import React, { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { account, ID } from "../lib/appwrite";

const Signin = () => {
  const [isPhoneAuth, setIsPhoneAuth] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userType, setUserType] = useState("user");

  const navigate = useNavigate();

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const fullPhoneNumber = `+91${phoneNumber}`;

    try {
      const token = await account.createPhoneToken(ID.unique(), fullPhoneNumber);
      setSuccess(true);
      navigate(
        `/verify?userId=${token.userId}&type=phone&userType=${userType}`
      );
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = await account.createEmailToken(ID.unique(), email);
      setSuccess(true);
      navigate(
        `/verify?userId=${token.userId}&type=email&userType=${userType}`
      );
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  return (
    <div className="signin-bg">
      <div className="signin-card">
        {/* User Type Selection */}
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <label className="signin-label" style={{ marginBottom: "0.5rem" }}>
            Sign in as:
          </label>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button
              type="button"
              className={`signin-toggle-btn${userType === "user" ? " active" : ""}`}
              onClick={() => setUserType("user")}
            >
              User
            </button>
            <button
              type="button"
              className={`signin-toggle-btn${userType === "clinic" ? " active" : ""}`}
              onClick={() => setUserType("clinic")}
            >
              Ayurvedic Clinic
            </button>
          </div>
        </div>

        {/* Toggle Phone / Email */}
        <div className="text-center mb-8">
          <button
            type="button"
            onClick={() => setIsPhoneAuth(true)}
            className={`signin-toggle-btn${isPhoneAuth ? " active" : ""}`}
          >
            <Phone />
          </button>
          <button
            type="button"
            onClick={() => setIsPhoneAuth(false)}
            className={`signin-toggle-btn${!isPhoneAuth ? " active" : ""}`}
          >
            <Mail />
          </button>
          <h2 className="signin-title">
            Sign in with {isPhoneAuth ? "Phone" : "Email"}
          </h2>
        </div>

        <form
          onSubmit={isPhoneAuth ? handlePhoneSubmit : handleEmailSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {isPhoneAuth ? (
            <div>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter 10-digit mobile number"
                className="signin-input"
              />
            </div>
          ) : (
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="signin-input"
              />
            </div>
          )}

          {error && <div className="signin-error">{error}</div>}
          {success && (
            <div className="signin-success">
              Verification code sent! Check your {isPhoneAuth ? "phone" : "email"}.
            </div>
          )}

          <button type="submit" disabled={isLoading} className="signin-btn">
            {isLoading ? "Sending..." : "Send verification code"}
          </button>
        </form>
      </div>

      {/* Internal CSS */}
      <style>{`
        .signin-bg {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #d6f0e4, #f7fff9);
          padding: 20px;
        }

        .signin-card {
          background: #fff;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          max-width: 420px;
          width: 100%;
          text-align: center;
          animation: fadeIn 0.5s ease-in-out;
        }

        .signin-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2c3e50;
          margin-top: 1rem;
        }

        .signin-input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }

        .signin-input:focus {
          border-color: #27ae60;
          box-shadow: 0 0 6px rgba(39, 174, 96, 0.3);
        }

        .signin-btn {
          padding: 12px;
          background: #27ae60;
          color: white;
          font-size: 1rem;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .signin-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .signin-btn:hover:not(:disabled) {
          background: #219150;
        }

        .signin-toggle-btn {
          background: #f0f0f0;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .signin-toggle-btn.active {
          background: #27ae60;
          color: white;
        }

        .signin-label {
          font-size: 1rem;
          font-weight: 500;
          color: #34495e;
        }

        .signin-error {
          color: #e74c3c;
          background: #fdecea;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .signin-success {
          color: #27ae60;
          background: #eafaf1;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.9rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Signin;
