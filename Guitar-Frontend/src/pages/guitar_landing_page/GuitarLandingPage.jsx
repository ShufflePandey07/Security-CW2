// import React, { useState } from "react";
// import "./LandingPage.css";

// const LandingPage = () => {
//   const [videoModalOpen, setVideoModalOpen] = useState(false);

//   const openVideoModal = () => {
//     setVideoModalOpen(true);
//   };

//   const closeVideoModal = () => {
//     setVideoModalOpen(false);
//   };

//   const products = [
//     {
//       id: 1,
//       name: "Wireless Headphones",
//       description: "Premium sound quality with noise cancellation",
//       image:
//         "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//     },
//     {
//       id: 2,
//       name: "Gaming Mouse",
//       description: "High-precision optical sensor for pro gamers",
//       image:
//         "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1028&q=80",
//     },
//     {
//       id: 3,
//       name: "Ultrabook Laptop",
//       description: "Powerful performance in a slim design",
//       image:
//         "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
//     },
//     {
//       id: 4,
//       name: "Condenser Microphone",
//       description: "Studio-quality audio recording",
//       image:
//         "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
//     },
//   ];

//   return (
//     <div className="landing-page">
//       <section className="hero">
//         <div className="hero-content">
//           <div className="hero-text">
//             <h1 className="title">
//               Discover Amazing <span className="highlight">Gadgets</span>
//             </h1>
//             <p className="subtitle">
//               Explore our curated collection of cutting-edge technology and
//               innovative products designed to enhance your daily life.
//             </p>
//             <div className="hero-actions">
//               <a href="#products" className="btn btn-primary">
//                 Shop Now
//               </a>
//               <button className="btn btn-secondary" onClick={openVideoModal}>
//                 Watch Video
//               </button>
//             </div>
//           </div>
//           <div className="hero-image">
//             <img
//               src="https://images.unsplash.com/photo-1573920011462-eb3003086611?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
//               alt="Latest gadgets"
//             />
//           </div>
//         </div>
//         <div className="hero-stats">
//           <div className="stat-item">
//             <p className="stat-number">299K+</p>
//             <p className="stat-label">Products</p>
//           </div>
//           <div className="stat-item">
//             <p className="stat-number">99K+</p>
//             <p className="stat-label">Sellers</p>
//           </div>
//           <div className="stat-item">
//             <p className="stat-number">2K+</p>
//             <p className="stat-label">Positive Reviews</p>
//           </div>
//         </div>
//       </section>

//       <section className="featured-products" id="products">
//         <div className="container">
//           <h2 className="title">Featured Products</h2>
//           <p className="subtitle">
//             Check out our latest and most popular gadgets that are
//             revolutionizing the tech world.
//           </p>
//           <div className="products">
//             {products.map((product) => (
//               <div key={product.id} className="product-item">
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="product-image"
//                 />
//                 <div className="product-info">
//                   <h3 className="product-title">{product.name}</h3>
//                   <p className="product-description">{product.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="features">
//         <div className="container">
//           <h2 className="title">Why Choose Us</h2>
//           <p className="subtitle">
//             We offer more than just products. Experience the difference with our
//             unique features and services.
//           </p>
//           <div className="features-grid">
//             <div className="feature-item">
//               <div className="feature-icon">🚚</div>
//               <h3 className="feature-title">Free Shipping</h3>
//               <p className="feature-description">
//                 Enjoy free shipping on all orders over $50
//               </p>
//             </div>
//             <div className="feature-item">
//               <div className="feature-icon">🔒</div>
//               <h3 className="feature-title">Secure Payments</h3>
//               <p className="feature-description">
//                 Your transactions are always safe and encrypted
//               </p>
//             </div>
//             <div className="feature-item">
//               <div className="feature-icon">🔄</div>
//               <h3 className="feature-title">Easy Returns</h3>
//               <p className="feature-description">
//                 30-day money-back guarantee on all purchases
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="testimonial">
//         <div className="container">
//           <h2 className="title">What Our Customers Say</h2>
//           <div className="testimonial-content">
//             <p className="testimonial-text">
//               "I've been a loyal customer for years, and I'm always impressed by
//               the quality of products and excellent customer service. Highly
//               recommended!"
//             </p>
//             <p className="testimonial-author">- Sarah Johnson</p>
//           </div>
//         </div>
//       </section>

//       <section className="cta">
//         <div className="container">
//           <h2 className="cta-title">Ready to Upgrade Your Tech?</h2>
//           <p className="cta-description">
//             Join thousands of satisfied customers and experience the future of
//             technology today.
//           </p>
//           <a href="#products" className="btn btn-secondary">
//             Shop Now
//           </a>
//         </div>
//       </section>

//       {videoModalOpen && (
//         <div className="video-modal">
//           <div className="video-modal-content">
//             <button className="close-modal" onClick={closeVideoModal}>
//               &times;
//             </button>
//             <iframe
//               width="560"
//               height="315"
//               src="https://www.youtube.com/embed/dQw4w9WgXcQ"
//               title="Product Video"
//               frameBorder="0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             ></iframe>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LandingPage;

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
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
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
