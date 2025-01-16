import {
  Favorite,
  FavoriteBorder,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Pagination,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addToCartApi,
  addToFavoriteApi,
  deleteFromFavoriteApi,
  getAllCartApi,
  getFavoriteByUserApi,
  getProductCountApi,
  paginationApi,
} from "../../Apis/api";

const Homepage = () => {
  const [gadgets, setGadgets] = useState([]);
  const [filteredGadgets, setFilteredGadgets] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [selectedGadget, setSelectedGadget] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoriteChange, setFavoriteChange] = useState(false);

  const pageSize = 8;

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [countRes, favRes] = await Promise.all([
          getProductCountApi(),
          getFavoriteByUserApi(),
        ]);
        setTotalItems(countRes.data.count);
        setFavorites(favRes.data.favorites);
        fetchProducts(page);
        fetchCart();
      } catch (err) {
        console.error("Error initializing data:", err);
        toast.error("Failed to load initial data");
      }
    };

    initializeData();
  }, [page, favoriteChange]);

  const fetchProducts = async (pageNumber) => {
    try {
      const res = await paginationApi(pageNumber, pageSize);
      setGadgets(res.data.products);
      handleSearch(searchQuery, res.data.products);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  const fetchCart = async () => {
    try {
      const response = await getAllCartApi();
      setCart(response.data.carts);
    } catch (err) {
      toast.error("Failed to fetch cart");
    }
  };

  const handleSearch = (query, products = gadgets) => {
    setSearchQuery(query);
    const filtered = products.filter((gadget) =>
      gadget.productName?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGadgets(filtered);
  };

  const handleAction = async (action, product) => {
    try {
      switch (action) {
        case "cart":
          await addToCartApi({
            productId: product._id,
            quantity: 1,
            total: product.productPrice,
          });
          await fetchCart();
          toast.success("Added to cart");
          break;
        case "favorite":
          await addToFavoriteApi({ productId: product._id });
          setFavoriteChange(!favoriteChange);
          toast.success("Added to favorites");
          break;
        case "unfavorite":
          await deleteFromFavoriteApi(product._id);
          setFavoriteChange(!favoriteChange);
          toast.success("Removed from favorites");
          break;
      }
    } catch (err) {
      toast.error(err.response?.data.message || `Failed to ${action} item`);
    }
  };

  const renderProduct = (guitar) => {
    const isFavorite = favorites.some(
      (fav) => fav.productId._id === guitar._id
    );

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={guitar._id}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              transition:
                "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardMedia
              component="img"
              height="260"
              image={`http://localhost:5000/products/${guitar.productImage}`}
              alt={guitar.productName}
              sx={{
                cursor: "pointer",
                objectFit: "cover",
              }}
              onClick={() => setSelectedGadget(guitar)}
            />
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "background.paper" },
              }}
              onClick={() =>
                handleAction(isFavorite ? "unfavorite" : "favorite", guitar)
              }
            >
              {isFavorite ? (
                <Favorite sx={{ color: "error.main" }} />
              ) : (
                <FavoriteBorder sx={{ color: "text.secondary" }} />
              )}
            </IconButton>
            <CardContent sx={{ flexGrow: 1, pb: "16px !important" }}>
              <Typography
                gutterBottom
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 500,
                  fontSize: "1.1rem",
                  mb: 0.5,
                }}
              >
                {guitar.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {guitar.productDescription.slice(0, 80)}...
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                >
                  ₹{guitar.productPrice.toLocaleString()}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAction("cart", guitar)}
                  startIcon={<ShoppingCart />}
                  sx={{
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    );
  };

  return (
    <Box sx={{ bgcolor: "#f7f9fc", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "relative",
          height: "400px",
          backgroundImage:
            'url("https://png.pngtree.com/background/20210711/original/pngtree-guitar-fresh-banner-picture-image_1076698.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          mb: 6,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.4)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            width: "100%",
            px: 3,
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Find Your Perfect Sound
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              mb: 4,
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Discover our collection of premium guitars
          </Typography>
          <TextField
            fullWidth
            placeholder="Search for your dream guitar..."
            onChange={(e) => handleSearch(e.target.value)}
            sx={{
              maxWidth: "600px",
              "& .MuiOutlinedInput-root": {
                bgcolor: alpha("#fff", 0.9),
                borderRadius: "50px",
                "&:hover": {
                  bgcolor: "#fff",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {filteredGadgets.map(renderProduct)}
        </Grid>

        <Box sx={{ mt: 6, mb: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(totalItems / pageSize)}
            page={page}
            onChange={(_, newPage) => setPage(newPage)}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "1rem",
              },
            }}
          />
        </Box>
      </Container>

      <Modal open={!!selectedGadget} onClose={() => setSelectedGadget(null)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 600 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: 2,
          }}
        >
          {selectedGadget && (
            <>
              <img
                src={`http://localhost:5000/products/${selectedGadget.productImage}`}
                alt={selectedGadget.productName}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "24px",
                }}
              />
              <Typography variant="h4" sx={{ mb: 2 }}>
                {selectedGadget.productName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedGadget.productDescription}
              </Typography>
              <Typography
                variant="h5"
                color="primary"
                sx={{ mb: 3, fontWeight: 600 }}
              >
                ₹{selectedGadget.productPrice.toLocaleString()}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    handleAction("cart", selectedGadget);
                    setSelectedGadget(null);
                  }}
                  startIcon={<ShoppingCart />}
                  fullWidth
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    handleAction("favorite", selectedGadget);
                    setSelectedGadget(null);
                  }}
                  startIcon={<FavoriteBorder />}
                  fullWidth
                >
                  Add to Favorites
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
      <ToastContainer position="bottom-right" />
    </Box>
  );
};

export default Homepage;
