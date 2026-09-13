import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { API_BASE_URL } from "../api";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/api/auth/admin-login`,
        {
          email: email.trim(),
          password,
        }
      );

      if (!response.data?.success || !response.data?.token) {
        throw new Error(
          response.data?.message || "Login failed"
        );
      }

      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      localStorage.setItem(
        "adminUser",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f6f8f7",
        fontFamily: "Inter",
        px: 2,

        "& *": {
          fontFamily: "inherit",
        },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            component="img"
            src={logo}
            alt="Vedhamruth"
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              objectFit: "cover",
              mx: "auto",
              mb: 2,
              display: "block",
            }}
          />

          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: "#17201b",
              fontFamily: "Inter",
            }}
          >
            Vedhamruth Admin
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 13,
              color: "#6b7280",
              fontFamily: "Inter",
            }}
          >
            Sign in to manage the store
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
              fontFamily: "Inter",
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            fullWidth
            autoFocus
            autoComplete="username"
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            fullWidth
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              mt: 1,
              py: 1.4,
              backgroundColor: "#00843d",
              borderRadius: "10px",
              fontFamily: "Inter",
              fontWeight: 600,
              minHeight: 48,

              "&:hover": {
                backgroundColor: "#006f34",
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={22}
                sx={{ color: "#FFFFFF" }}
              />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
