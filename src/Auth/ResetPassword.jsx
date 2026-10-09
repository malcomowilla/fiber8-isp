import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { Email, ArrowBack } from "@mui/icons-material";
import ResetNotification from "../notification/ResetNotification";
import { useApplicationSettings } from "../settings/ApplicationSettings";
import toast, { Toaster } from "react-hot-toast";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const { companySettings } = useApplicationSettings();
  const { company_name, logo_preview } = companySettings;
  const navigate = useNavigate();

  const subdomain = window.location.hostname.split(".")[0];

  // Generated once so the dots don't jump around on every keystroke
  const particles = useMemo(
    () =>
      [...Array(20)].map(() => ({
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 5 + 3}s`,
      })),
    []
  );

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = { email };

    try {
      const response = await fetch("/api/password/reset", {
        method: "POST",
        headers: {
          "X-Subdomain": subdomain,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail("");
        navigate("/reset-password-email-sent");
        setMessage(data.message);
        setError("");
      } else {
        toast.error(data.error, {
          duration: 4000,
          position: "top-center",
        });
        setError(data.error);
        setMessage("");
      }
    } catch (error) {
      toast.error("failed to send reset email server error", {
        duration: 4000,
        position: "top-center",
      });
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Toaster />
      <ResetNotification
        handleClose={handleClose}
        open={open}
        message={message}
        error={error}
      />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/images/Telecommunications-Aitechs.jpg"
            alt="Network Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        </div>

        <div className="absolute inset-0 opacity-20">
          {particles.map((style, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-green-400 animate-spin"
              style={style}
            />
          ))}
        </div>

        <motion.section
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full max-w-md z-10 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-white/20"
        >
          <div className="flex flex-col items-center">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-4 bg-green-600/20 rounded-full">
                <img
                  className="w-24 h-24 mx-auto rounded-full"
                  src={logo_preview || "/images/owitech-logo.png"}
                  alt={company_name || "Owitech"}
                  onError={(e) => {
                    e.target.src = "/images/owitech-logo.png";
                  }}
                />
              </div>
            </div>

            <form onSubmit={handleSignIn} className="w-full space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <TextField
                  sx={textFieldStyles}
                  fullWidth
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email className="text-gray-500" />
                      </InputAdornment>
                    ),
                  }}
                  className="bg-white rounded-lg myTextField"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center cursor-pointer justify-start"
              >
                <Link
                  to="/signin"
                  className="flex items-center relative cursor-pointer text-green-600 hover:text-green-500 dark:text-green-400"
                >
                  <ArrowBack className="mr-2 text-white" />
                  <span className="text-white">Back to Login</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex justify-center"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  className="w-full py-3 text-white font-medium rounded-lg transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} className="text-white" />
                  ) : (
                    <p className="font-sans">Reset Password</p>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.section>
      </motion.main>
    </>
  );
}

const textFieldStyles = {
  // Typed text: dark so it's readable on the white field background
  "& .MuiInputBase-input": {
    color: "#111827",
    "&::placeholder": { color: "#6b7280", opacity: 1 },
    // keep browser autofill from turning text/background weird
    "&:-webkit-autofill": {
      WebkitTextFillColor: "#111827",
      WebkitBoxShadow: "0 0 0 100px #ffffff inset",
    },
  },
  "& .MuiInputLabel-root": { color: "rgba(0,0,0,0.6)" },
  "& label.Mui-focused": { color: "#16a34a", fontSize: "16px" },
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "& fieldset": { borderColor: "rgba(0,0,0,0.25)" },
    "&:hover fieldset": { borderColor: "rgba(0,0,0,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#4ade80", borderWidth: "2px" },
  },
};

export default ResetPassword;