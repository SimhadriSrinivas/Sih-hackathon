// src/pages/Verify.jsx
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { OTPInput } from "../components/OTPInput";
import { account, databases, Query } from "../lib/appwrite";

export default function Verify() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId"); // Appwrite user ID
  const type = searchParams.get("type");
  const userType = searchParams.get("userType");

  const navigate = useNavigate();

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Verifying with userId:", userId, "otp:", otpString);

      // 🔹 Safe logout: wrap in try/catch
      try {
        await account.deleteSession("current");
      } catch (logoutErr) {
        console.warn("No active session to delete:", logoutErr.message);
      }

      if (!userId || !otpString) {
        setError("Missing userId or OTP. Please restart the sign-in process.");
        setIsLoading(false);
        return;
      }

      // 🔹 Create session using Appwrite
      const session = await account.createSession(userId, otpString);

      if (session && session.userId) {
        if (userType === "clinic") {
          // 🔹 Look for existing clinic linked to this user
          try {
            const dbId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
            const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

            // IMPORTANT: Replace 'ownerId' with the correct field in your Clinic collection
            const res = await databases.listDocuments(dbId, collectionId, [
              Query.equal("ownerId", session.userId),
            ]);

            const foundClinic = res.documents.length > 0;
            if (foundClinic) {
              // Save clinic ID in localStorage for dashboard
              window.localStorage.setItem("clinicId", res.documents[0].$id);
              navigate("/clinics/doctordashbord", { replace: true });
            } else {
              navigate("/clinics/signup", { replace: true });
            }
          } catch (clinicErr) {
            console.error("Error checking clinic:", clinicErr.message);
            navigate("/clinics/signup", { replace: true });
          }
        } else if (userType === "user") {
          navigate("/users/UserSignup.jsx", { replace: true });
        } else {
          navigate("/users/UserSignup.jsx", { replace: true });
        }
      } else {
        setError("Session creation failed. Please try again.");
      }
    } catch (err) {
      console.error("OTP Verification failed:", err.message);
      setError("Verification failed: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .verify-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .verify-card {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          border: 1px solid #a5b4fc;
        }
        .verify-icon-bg {
          background: #e0e7ff;
          width: 4rem;
          height: 4rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
        }
        .verify-title {
          font-size: 2rem;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        .verify-desc {
          color: #6366f1;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .otp-input-container {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin: 1.5rem 0 0.5rem 0;
        }
        .otp-input-box {
          width: 3rem;
          height: 3.2rem;
          font-size: 1.5rem;
          text-align: center;
          border: 2px solid #d1d5db;
          border-radius: 0.5rem;
          background: #f9fafb;
          color: #1e293b;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .otp-input-box:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px #c7d2fe;
          background: #fff;
        }
        .verify-error {
          color: #dc2626;
          font-size: 0.95rem;
          text-align: center;
          margin-bottom: 1rem;
        }
        .verify-btn {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #fff;
          background: #6366f1;
          transition: background 0.2s;
          cursor: pointer;
          margin-bottom: 0.5rem;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .verify-btn:hover:not(:disabled) {
          background: #4338ca;
        }
        .verify-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .verify-alt-btn {
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #374151;
          background: #fff;
          transition: background 0.2s;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .verify-alt-btn:hover {
          background: #f3f4f6;
        }
      `}</style>
      <div className="verify-bg">
        <div className="verify-card">
          <div className="text-center mb-8">
            <div className="verify-icon-bg">
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="verify-title">OTP Verification</h2>
            <p className="verify-desc">
              One Time Password (OTP) has been sent via{" "}
              {type === "email" ? "Email to" : "SMS to"} <br />
              <span style={{ fontWeight: 500 }}>
                {type === "email"
                  ? searchParams.get("email")
                  : searchParams.get("phone")}
              </span>
              .<br />
              Enter the OTP below to verify it.
            </p>
          </div>

          <div className="otp-input-container">
            <OTPInput otp={otp} setOtp={setOtp} />
          </div>

          {error && <div className="verify-error">{error}</div>}

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className="verify-btn"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={() => navigate("/signin")}
            className="verify-alt-btn"
          >
            Try a different number
          </button>
        </div>
      </div>
    </>
  );
}
