import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import CloseIcon from "@mui/icons-material/Close";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

const GuitarLandingPage = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const guitars = [
    {
      id: 1,
      name: "Martin D-28 Acoustic",
      description: "Classic dreadnought with rich, powerful tone",
      image:
        "https://dreamtone.au/cdn/shop/files/MartinD-28StandardSeriesDreadnoughtAcousticFrontDreamtone.jpg?v=1715257624&width=1946",
      type: "acoustic",
      price: "$2,999",
    },
    {
      id: 2,
      name: "Fender Stratocaster",
      description: "Iconic electric with versatile sound palette",
      image:
        "https://imgcdn.stablediffusionweb.com/2024/9/30/e6d1f490-6126-467c-b308-cc328c1d443c.jpg",
      type: "electric",
      price: "$1,499",
    },
    {
      id: 3,
      name: "Taylor 814ce",
      description: "Premium acoustic-electric with cutting-edge electronics",
      image:
        "https://www.kauffmannsguitarstore.com/wp-content/uploads/2022/08/Taylor-814ce-2.jpg",
      type: "acoustic",
      price: "$3,499",
    },
    {
      id: 4,
      name: "Gibson Les Paul Standard",
      description: "Legendary electric with unmistakable sustain",
      image:
        "https://guitargeargiveaway.co.uk/wp-content/uploads/2024/04/Gibson-Les-Paul-Standard-in-Wine-Red-1.jpg",
      type: "electric",
      price: "$2,699",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(to right, #1a237e, #311b92)",
          color: "white",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                component="h1"
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Discover Your Perfect
                <Box component="span" sx={{ color: "#ffd700" }}>
                  {" "}
                  Guitar
                </Box>
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                From vintage acoustics to modern electric masterpieces, find
                your dream instrument.
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "#ffd700",
                    color: "#000",
                    "&:hover": { bgcolor: "#ffc400" },
                  }}
                  endIcon={<ArrowForwardIcon />}
                  href="#guitars"
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ color: "white", borderColor: "white" }}
                  onClick={() => setVideoModalOpen(true)}
                >
                  Watch Demo
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.alphacoders.com/876/876726.jpg"
                alt="Featured Guitar"
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>

          {/* Stats */}
          <Grid container spacing={4} sx={{ mt: 6 }}>
            {[
              { number: "1000+", label: "Guitars" },
              { number: "50+", label: "Brands" },
              { number: "10K+", label: "Happy Musicians" },
            ].map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: "#ffd700" }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="h6">{stat.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Guitars */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="guitars">
        <Typography
          variant="h3"
          sx={{ mb: 2, textAlign: "center", fontWeight: 700 }}
        >
          Featured Guitars
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 6, textAlign: "center", color: "text.secondary" }}
        >
          Handpicked selections from legendary manufacturers
        </Typography>
        <Grid container spacing={4}>
          {guitars.map((guitar) => (
            <Grid item key={guitar.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={guitar.image}
                  alt={guitar.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {guitar.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {guitar.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    {guitar.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features */}
      <Box sx={{ bgcolor: "white", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{ mb: 6, textAlign: "center", fontWeight: 700 }}
          >
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
                title: "Free Shipping",
                description: "Free shipping on all orders over $500",
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 40 }} />,
                title: "Secure Payments",
                description: "Your transactions are always protected",
              },
              {
                icon: <AssignmentReturnIcon sx={{ fontSize: 40 }} />,
                title: "45-Day Returns",
                description: "Try your instrument worry-free",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                  }}
                >
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonial */}
      <Box
        sx={{
          bgcolor: "#1a237e",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 4 }}>
            "The selection and service here is unmatched. Found my dream Martin
            guitar and couldn't be happier!"
          </Typography>
          <Typography variant="h6">
            - John Mayer, Professional Musician
          </Typography>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ bgcolor: "white", py: 8, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            Ready to Find Your Sound?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "text.secondary" }}>
            Join thousands of musicians who've found their perfect instrument
            with us.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#1a237e",
              "&:hover": { bgcolor: "#311b92" },
            }}
            href="#guitars"
          >
            Browse Guitars
          </Button>
        </Container>
      </Box>

      {/* Video Modal */}
      <Dialog
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <IconButton
            onClick={() => setVideoModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ pt: "56.25%", position: "relative" }}>
            <iframe
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              src="https://www.youtube.com/@GuitarShopnp"
              title="Product Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GuitarLandingPage;
