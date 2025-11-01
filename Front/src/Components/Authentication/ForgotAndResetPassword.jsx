import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import

function ForgotAndResetPassword() {
  const [step, setStep] = useState("forgot");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Add this

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message || "OTP sent to your email");
      setMessageType("success");
      setStep("reset");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/reset-password", { email, otp, newPassword });
      setMessage(res.data.message || "Password reset successfully");
      setMessageType("success");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Password reset failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === "forgot" ? "Forgot Password" : "Reset Password"}
        </h2>
        {message && (
          <div className={`mb-4 p-3 rounded text-center font-semibold ${
            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
        {step === "forgot" ? (
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="w-full py-2 bg-cyan-500 text-white rounded">
              {loading ? "Sending..." : "Send OTP"}
            </button>
            
            {/* Add this link to Verify Code page */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate("/verify-email")}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Already have OTP? Verify Here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 mb-4 border rounded"
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="w-full py-2 bg-green-600 text-white rounded">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotAndResetPassword;