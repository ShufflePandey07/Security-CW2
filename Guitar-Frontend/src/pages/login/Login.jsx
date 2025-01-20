import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserApi } from "../../Apis/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { email, password };

    loginUserApi(data)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setTimeout(() => {
            window.location.href =
              res.data.user.role === "admin" ? "/admin/dashboard" : "/";
          }, 1000);
        }
      })
      .catch((err) => {
        const message = err.response?.data?.message || "Something went wrong";
        toast.error(message);
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), 
        url('https://wallpapers.com/images/featured/guitar-pictures-rm7sapdj9gdi6nef.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 3, sm: 6 },
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{
              mb: 4,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #f50057, #ff4081)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              margin="normal"
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              margin="normal"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: "linear-gradient(45deg, #f50057, #ff4081)",
                "&:hover": {
                  background: "linear-gradient(45deg, #ff4081, #f50057)",
                },
              }}
            >
              Log In
            </Button>
          </form>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <MuiLink
              component={Link}
              to="/forgot_password"
              sx={{
                color: "#f50057",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Forgot password?
            </MuiLink>
          </Box>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            Don't have an account?{" "}
            <MuiLink
              component={Link}
              to="/register"
              sx={{
                color: "#f50057",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sign up
            </MuiLink>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
