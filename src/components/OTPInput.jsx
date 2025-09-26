import React, { useState, useEffect } from "react";

export function OTPInput({ otp, setOtp, onResend }) {
  const [timer, setTimer] = useState(30); // 30 seconds for resend

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < otp.length - 1) {
      document.getElementById(`otp-input-${idx + 1}`).focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      document.getElementById(`otp-input-${idx - 1}`).focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    if (onResend) onResend();
  };

  return (
    <div>
      <div className="otp-input-container">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-input-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-input-box"
            value={digit}
            onChange={(e) => handleOtpChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            autoFocus={idx === 0}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "0.75rem" }}>
        {timer > 0 ? (
          <span style={{ color: "#6b7280", fontSize: "0.95rem" }}>
            Resend OTP in <b>00:{timer.toString().padStart(2, "0")}</b>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "#6366f1",
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "0.95rem",
              textDecoration: "underline",
            }}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
