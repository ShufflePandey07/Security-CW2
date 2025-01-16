import {
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LocationOn as LocationIcon,
  MusicNote as MusicNoteIcon,
  Phone as PhoneIcon,
  Twitter as TwitterIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

const ContactUs = () => {
  const theme = useTheme();

  const contactInfo = [
    {
      icon: <LocationIcon fontSize="large" />,
      title: "Visit Our Store",
      details: "123 Guitar Street, Nashville, TN 37203",
    },
    {
      icon: <PhoneIcon fontSize="large" />,
      title: "Call Us",
      details: "+1 (615) 555-0123",
    },
    {
      icon: <EmailIcon fontSize="large" />,
      title: "Email Us",
      details: "contact@guitarheaven.com",
    },
  ];

  const socialMedia = [
    { icon: <FacebookIcon />, label: "Facebook" },
    { icon: <TwitterIcon />, label: "Twitter" },
    { icon: <InstagramIcon />, label: "Instagram" },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
        py: 8,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Contact Form Section */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={5}
              sx={{
                p: 4,
                borderRadius: "20px",
                background: "#fff",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  p: 2,
                  opacity: 0.1,
                }}
              >
                <MusicNoteIcon sx={{ fontSize: 100 }} />
              </Box>

              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontFamily: "'Gibson', sans-serif",
                  background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Let's Talk Music
              </Typography>

              <Typography
                variant="body1"
                sx={{ mb: 4, color: theme.palette.text.secondary }}
              >
                Have questions about our guitars or services? We'd love to hear
                from you!
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    required
                    type="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Subject" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      py: 1.5,
                      px: 4,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      "&:hover": {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Contact Info Section */}
          <Grid item xs={12} md={5}>
            <Box>
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: "15px",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box
                        sx={{
                          color: theme.palette.primary.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {info.icon}
                      </Box>
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6" gutterBottom>
                        {info.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {info.details}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))}

              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: "15px",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: "white",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Follow Us
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {socialMedia.map((social, index) => (
                    <IconButton
                      key={index}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.2)",
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactUs;
