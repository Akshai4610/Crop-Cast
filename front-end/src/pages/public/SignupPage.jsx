import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

import FloatingInput from "../../components/auth/FloatingInput";
import PasswordStrength from "../../components/auth/PasswordsStrength";
import OTPModal from "../../components/auth/OTPModal";

import { registerUser } from "../../services/api";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await registerUser(form);

      // open OTP modal instead of redirect
      setOtpOpen(true);
    } catch (err) {
      alert(err?.response?.data?.detail || "Signup failed");
    }

    setLoading(false);
  };

  const handleVerifyOTP = (otp) => {
    console.log("OTP:", otp);

    setOtpOpen(false);

    alert("🎉 Email verified successfully!");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-900 to-green-900 flex flex-col">
      <Navbar />

      <main className="grow flex items-center justify-center px-6 py-24">
        <div className="glass-card max-w-md w-full animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Create Account
          </h2>

          <form className="space-y-5" onSubmit={handleSignup}>
            <FloatingInput
              name="fullname"
              label="Full Name"
              value={form.fullname}
              onChange={handleChange}
            />

            <FloatingInput
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
            />

            <div className="relative">
              <FloatingInput
                type={showPass ? "text" : "password"}
                name="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
              />

              {/* 🔥 Animated Eye Button */}
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-4 text-gray-300 hover:text-white transition duration-300"
              >
                <span className="relative flex items-center justify-center">
                  {/* Eye */}
                  <span
                    className={`transition-all duration-300 ${showPass ? "scale-90 opacity-70" : "scale-100"}`}
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>

                  {/* Blink overlay */}
                  <span
                    className={`absolute w-full h-0.5 bg-white transition-all duration-300 
        ${showPass ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}
      `}
                  ></span>
                </span>
              </button>

              <PasswordStrength password={form.password} />
            </div>

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-linear-to-r from-emerald-400 to-green-500 text-black font-semibold flex justify-center"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
        </div>
      </main>

      <Footer />

      <OTPModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={handleVerifyOTP}
      />
    </div>
  );
}
