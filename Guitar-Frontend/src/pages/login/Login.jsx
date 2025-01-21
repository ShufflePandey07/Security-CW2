import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserApi, otpVerificationApi } from "../../Apis/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // OTP related states
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  // ReCAPTCHA ref
  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get ReCAPTCHA token
    const captchaToken = recaptchaRef.current.getValue();
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA verification");
      return;
    }

    setLoading(true);
    const data = {
      email,
      password,
      captchaToken, // Include the token in the API request
    };

    try {
      const res = await loginUserApi(data);
      if (res.data.success) {
        toast.success("Please verify OTP sent to your email");
        setOpenOtpDialog(true);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
      // Reset ReCAPTCHA after attempt
      recaptchaRef.current.reset();
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setOtpLoading(true);

    try {
      const data = { email, otp };
      const res = await otpVerificationApi(data);

      if (res.status === 200) {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setOpenOtpDialog(false);

        setTimeout(() => {
          window.location.href =
            res.data.user.role === "admin" ? "/admin/dashboard" : "/";
        }, 1000);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Invalid OTP";
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
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

            {/* Visible ReCAPTCHA */}
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LfpJ74qAAAAAE8hjbJ-AeYqlUpAFSyizUIxNeUq"
              />
            </Box>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Log In"
              )}
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

      {/* OTP Verification Dialog */}
      <Dialog
        open={openOtpDialog}
        onClose={() => !otpLoading && setOpenOtpDialog(false)}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            OTP Verification
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please enter the OTP sent to your email
          </Typography>
        </DialogTitle>
        <form onSubmit={handleOtpVerification}>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              fullWidth
              required
              margin="normal"
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{
                maxLength: 6,
                style: {
                  textAlign: "center",
                  letterSpacing: "0.5em",
                  fontSize: "1.5em",
                },
              }}
              disabled={otpLoading}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={otpLoading}
              sx={{
                py: 1.5,
                background: "linear-gradient(45deg, #f50057, #ff4081)",
                "&:hover": {
                  background: "linear-gradient(45deg, #ff4081, #f50057)",
                },
              }}
            >
              {otpLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify OTP"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Login;
