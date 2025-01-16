import {
  Build as BuildIcon,
  Groups as GroupsIcon,
  MusicNote as MusicNoteIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

const AboutUs = () => {
  const theme = useTheme();

  const stats = [
    {
      icon: <MusicNoteIcon fontSize="large" />,
      value: "1978",
      label: "Since",
    },
    {
      icon: <StarIcon fontSize="large" />,
      value: "10K+",
      label: "Guitars Sold",
    },
    {
      icon: <BuildIcon fontSize="large" />,
      value: "5000+",
      label: "Repairs Done",
    },
    {
      icon: <GroupsIcon fontSize="large" />,
      value: "15K+",
      label: "Happy Musicians",
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -20,
                  left: -20,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  opacity: 0.1,
                  borderRadius: "20px",
                  zIndex: 0,
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1, p: 4 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    color: theme.palette.primary.main,
                    fontFamily: "'Fender', sans-serif",
                    mb: 2,
                  }}
                >
                  Our Melody
                </Typography>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    fontFamily: "'Gibson', sans-serif",
                    background: `-webkit-linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Crafting Musical Dreams For Over 40 Years
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1.8,
                    mb: 4,
                  }}
                >
                  Founded by master luthier James Harrison in 1978, Guitar
                  Heaven began as a small repair shop in Nashville. Today, we're
                  one of America's premier destinations for musicians,
                  collectors, and enthusiasts. Our commitment to quality
                  craftsmanship, expert knowledge, and personalized service has
                  helped countless musicians find their perfect sound.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={5}
              sx={{
                p: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                borderRadius: "20px",
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  background: 'url("/guitar-pattern.png")',
                  opacity: 0.1,
                  zIndex: 0,
                },
              }}
            >
              <Grid container spacing={3}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} key={index}>
                    <Card
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        color: "white",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            mb: 1,
                            fontFamily: "'Gibson', sans-serif",
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            opacity: 0.8,
                            fontFamily: "'Fender', sans-serif",
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;
