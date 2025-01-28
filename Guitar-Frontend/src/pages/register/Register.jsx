import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { registerUserApi } from "../../Apis/api";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const recaptchaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    // Verify ReCAPTCHA
    const recaptchaToken = recaptchaRef.current.getValue();
    if (!recaptchaToken) {
      toast.error("Please complete the CAPTCHA verification");
      return;
    }

    setLoading(true);
    const data = {
      fullName,
      email,
      phone,
      password,
      captchaToken: recaptchaToken,
    };

    try {
      const res = await registerUserApi(data);
      if (res.status === 201) {
        toast.success(res.data.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
      recaptchaRef.current.reset();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), 
        url('https://wallpapers.com/images/featured/guitar-pictures-rm7sapdj9gdi6nef.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: { xs: 2, sm: 4 },
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: 4,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            align="center"
            sx={{
              mb: 2,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #f50057, #ff4081)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Join the Guitar Community
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              size="small"
              margin="dense"
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              size="small"
              margin="dense"
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
              size="small"
              margin="dense"
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              size="small"
              margin="dense"
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
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              required
              size="small"
              margin="dense"
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" color="textSecondary">
                  I agree to the Terms of Service and Privacy Policy
                </Typography>
              }
              sx={{ mt: 1 }}
            />

            {/* ReCAPTCHA */}
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
                mt: 2,
                mb: 1,
                py: 1,
                background: "linear-gradient(45deg, #f50057, #ff4081)",
                "&:hover": {
                  background: "linear-gradient(45deg, #ff4081, #f50057)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
