// import { DeleteOutlined, HeartOutlined } from "@ant-design/icons";
// import { Button, Image, message, Skeleton } from "antd";
// import { AnimatePresence, motion } from "framer-motion";
// import React, { useEffect, useState } from "react";
// import styled from "styled-components";
// import { deleteFromFavoriteApi, getFavoriteByUserApi } from "../../Apis/api";

// const FavouritesContainer = styled(motion.div)`
//   max-width: 1200px;
//   margin: 2rem auto;
//   padding: 2rem;
//   background: #f8f9fa;
//   border-radius: 15px;
//   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
// `;

// const FavouriteItem = styled(motion.div)`
//   display: flex;
//   align-items: center;
//   background: white;
//   padding: 1.5rem;
//   border-radius: 10px;
//   margin-bottom: 1.5rem;
//   box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: translateY(-5px);
//   }
// `;

// const ItemDetails = styled.div`
//   flex: 1;
//   margin-left: 1.5rem;
// `;

// const ItemName = styled.h3`
//   font-size: 1.2rem;
//   margin-bottom: 0.5rem;
//   color: #2c3e50;
// `;

// const ItemPrice = styled.p`
//   font-weight: bold;
//   color: #e74c3c;
//   font-size: 1.1rem;
// `;

// const EmptyFavouritesMessage = styled.div`
//   text-align: center;
//   font-size: 1.2rem;
//   margin-top: 2rem;
// `;

// const Favourites = () => {
//   const [loading, setLoading] = useState(true);
//   const [favouriteItems, setFavouriteItems] = useState([]);
//   const [changefav, setChangeFav] = useState(false);

//   useEffect(() => {
//     fetchFavorites();
//   }, [changefav]);

//   const fetchFavorites = () => {
//     getFavoriteByUserApi()
//       .then((res) => {
//         console.log(res.data.favorites);
//         setFavouriteItems(res.data.favorites);
//         setLoading(false);
//       })
//       .catch((err) => {
//         message.error(err.response?.data?.message || "Something went wrong");
//       });
//   };

//   const handleDeleteFavourite = (favouriteId) => {
//     deleteFromFavoriteApi(favouriteId) // Using deleteCartApi as a placeholder
//       .then(() => {
//         setChangeFav(!changefav);
//         message.success("Item removed from favourites");
//       })
//       .catch((err) => {
//         message.error(err.response?.data?.message || "Something went wrong");
//       });
//   };

//   if (loading) {
//     return (
//       <FavouritesContainer>
//         {[...Array(3)].map((_, index) => (
//           <Skeleton key={index} active avatar paragraph={{ rows: 3 }} />
//         ))}
//       </FavouritesContainer>
//     );
//   }

//   return (
//     <FavouritesContainer
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h2>
//         <HeartOutlined /> Your Favourites
//       </h2>
//       <AnimatePresence>
//         {favouriteItems.length > 0 ? (
//           favouriteItems.map((item, index) => (
//             <FavouriteItem
//               key={item._id}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//             >
//               <Image
//                 width={150}
//                 src={`https://localhost:5000/products/${item.productId.productImage}`}
//                 alt={item.productName}
//                 preview={{
//                   src: `https://localhost:5000/products/${item.productId.productImage}`,
//                 }}
//               />
//               <ItemDetails>
//                 <ItemName>{item.productId.productName}</ItemName>
//                 <ItemPrice>Rs. {item.productId.productPrice}</ItemPrice>
//                 <p>{item.productDescription}</p>
//               </ItemDetails>
//               <Button
//                 type="primary"
//                 danger
//                 icon={<DeleteOutlined />}
//                 onClick={() => handleDeleteFavourite(item.productId._id)}
//               >
//                 Remove
//               </Button>
//             </FavouriteItem>
//           ))
//         ) : (
//           <EmptyFavouritesMessage>
//             <HeartOutlined style={{ fontSize: 50, marginBottom: "1rem" }} />
//             <p>Your favourites list is empty. Start adding items now!</p>
//           </EmptyFavouritesMessage>
//         )}
//       </AnimatePresence>
//     </FavouritesContainer>
//   );
// };

// export default Favourites;

import {
  Delete,
  Favorite,
  ShoppingBag,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { deleteFromFavoriteApi, getFavoriteByUserApi } from "../../Apis/api";

const Favourites = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [changeFav, setChangeFav] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    fetchFavorites();
  }, [changeFav]);

  const fetchFavorites = async () => {
    try {
      const res = await getFavoriteByUserApi();
      setFavouriteItems(res.data.favorites);
      setLoading(false);
    } catch (err) {
      handleSnackbar(
        err.response?.data?.message || "Failed to load favorites",
        "error"
      );
      setLoading(false);
    }
  };

  const handleDeleteFavourite = async (favouriteId) => {
    try {
      await deleteFromFavoriteApi(favouriteId);
      setChangeFav(!changeFav);
      handleSnackbar("Item removed from favorites");
    } catch (err) {
      handleSnackbar(
        err.response?.data?.message || "Failed to remove item",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          display: "flex",
          alignItems: "center",
          color: theme.palette.primary.main,
          mb: 4,
        }}
      >
        <Favorite sx={{ mr: 2 }} />
        Your Favorite Guitars
      </Typography>

      {favouriteItems.length > 0 ? (
        <Grid container spacing={3}>
          {favouriteItems.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: theme.shadows[10],
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={`https://localhost:5000/products/${item.productId.productImage}`}
                  alt={item.productName}
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 2,
                    boxShadow: theme.shadows[4],
                  }}
                />

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {item.productId.productName}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    Rs. {item.productId.productPrice.toLocaleString()}
                  </Typography>
                </Box>

                <Typography
                  color="text.secondary"
                  sx={{
                    mb: 3,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "48px",
                  }}
                >
                  {item.productDescription}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    fullWidth
                    href={`/product/${item.productId._id}`}
                  >
                    View Details
                  </Button>
                  <IconButton
                    color="error"
                    sx={{
                      border: `1px solid ${theme.palette.error.main}`,
                      "&:hover": {
                        backgroundColor: theme.palette.error.main,
                        color: "white",
                      },
                    }}
                    onClick={() => handleDeleteFavourite(item.productId._id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Favorite
            sx={{
              fontSize: 80,
              color: theme.palette.grey[300],
              mb: 2,
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your favorites list is empty
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Explore our collection and add your favorite guitars!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBag />}
            href="/userdashboard"
          >
            Explore Guitars
          </Button>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Favourites;
