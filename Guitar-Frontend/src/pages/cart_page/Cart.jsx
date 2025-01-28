// import {
//   Add,
//   CreditCard,
//   Delete,
//   LocalShipping,
//   Remove,
//   ShoppingBag,
//   ShoppingCart,
// } from "@mui/icons-material";
// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   Divider,
//   FormControlLabel,
//   Grid,
//   IconButton,
//   Paper,
//   Radio,
//   RadioGroup,
//   Snackbar,
//   TextField,
//   Typography,
//   useTheme,
// } from "@mui/material";
// import KhaltiCheckout from "khalti-checkout-web";
// import React, { useEffect, useState } from "react";
// import {
//   createOrderApi,
//   deleteCartApi,
//   getAllCartApi,
//   updateCartApi,
//   updateCartStatusApi,
// } from "../../Apis/api";

// const Cart = () => {
//   const theme = useTheme();
//   const [address, setAddress] = useState("KTM");
//   const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
//   const [total, setTotal] = useState(0);
//   const [subTotal, setSubTotal] = useState(0);
//   const [deliveryCharge, setDeliveryCharge] = useState(50);
//   const [loading, setLoading] = useState(true);
//   const [cartItems, setCartItems] = useState([]);
//   const [change, setChange] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const handleSnackbar = (message, severity = "success") => {
//     setSnackbar({ open: true, message, severity });
//   };

//   const handleQuantityChange = async (value, cart) => {
//     if (value < 1) return;

//     try {
//       const updatedCartItems = cartItems.map((item) =>
//         item._id === cart._id
//           ? {
//               ...item,
//               quantity: value,
//               total: item.productId.productPrice * value,
//             }
//           : item
//       );
//       setCartItems(updatedCartItems);

//       const data = {
//         quantity: value,
//         total: cart.productId.productPrice * value,
//       };

//       await updateCartApi(cart._id, data);
//       handleSnackbar("Cart updated successfully");
//     } catch (err) {
//       handleSnackbar(
//         err.response?.data?.message || "Something went wrong",
//         "error"
//       );
//     }
//   };

//   const handleDeleteCartItem = async (cartId) => {
//     try {
//       await deleteCartApi(cartId);
//       setCartItems(cartItems.filter((item) => item._id !== cartId));
//       handleSnackbar("Item deleted successfully");
//     } catch (err) {
//       handleSnackbar(
//         err.response?.data?.message || "Something went wrong",
//         "error"
//       );
//     }
//   };

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await getAllCartApi();
//         setCartItems(res.data.carts);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setLoading(false);
//         handleSnackbar("Failed to load cart items", "error");
//       }
//     };
//     fetchCart();
//   }, [change]);

//   useEffect(() => {
//     const total = cartItems.reduce((acc, cart) => acc + cart.total, 0);
//     setSubTotal(total);
//     setTotal(total + deliveryCharge);
//   }, [cartItems, deliveryCharge, change]);

//   const khaltiConfig = {
//     publicKey: "test_public_key_0800545e039d45368cab4d1b2fb93d01",
//     productIdentity: "1234567890",
//     productName: "Guitar Purchase",
//     productUrl: "http://localhost:3000/cart",
//     paymentPreference: [
//       "KHALTI",
//       "EBANKING",
//       "MOBILE_BANKING",
//       "CONNECT_IPS",
//       "SCT",
//     ],
//     eventHandler: {
//       onSuccess(payload) {
//         handlePayment();
//         handleSnackbar("Payment successful");
//       },
//       onError(error) {
//         handleSnackbar("Payment failed", "error");
//       },
//       onClose() {
//         console.log("Payment widget closed");
//       },
//     },
//   };

//   const handleKhaltiPayment = () => {
//     if (!address.trim()) {
//       handleSnackbar("Please enter your address", "error");
//       return;
//     }
//     const checkout = new KhaltiCheckout(khaltiConfig);
//     checkout.show({ amount: total * 100 });
//   };

//   const handlePayment = async () => {
//     try {
//       const data = {
//         address,
//         carts: cartItems,
//         totalAmount: total,
//         paymentType: paymentMethod,
//       };
//       await createOrderApi(data);
//       await updateCartStatusApi({ status: "ordered" });
//       setChange(!change);
//       handleSnackbar("Order placed successfully");
//     } catch (err) {
//       handleSnackbar(
//         err.response?.data?.message || "Something went wrong",
//         "error"
//       );
//     }
//   };

//   const handleBuyNow = () => {
//     if (!address.trim()) {
//       handleSnackbar("Please enter your address", "error");
//       return;
//     }
//     if (!paymentMethod) {
//       handleSnackbar("Please select a payment method", "error");
//       return;
//     }
//     if (paymentMethod === "Khalti") {
//       handleKhaltiPayment();
//     } else {
//       handlePayment();
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         minHeight="60vh"
//       >
//         <CircularProgress size={60} />
//       </Box>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       <Typography
//         variant="h4"
//         gutterBottom
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           color: theme.palette.primary.main,
//           mb: 4,
//         }}
//       >
//         <ShoppingBag sx={{ mr: 2 }} />
//         Guitar Shopping Cart
//       </Typography>

//       {cartItems.length > 0 ? (
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={8}>
//             {cartItems.map((cart) => (
//               <Paper
//                 key={cart._id}
//                 elevation={3}
//                 sx={{
//                   p: 3,
//                   mb: 3,
//                   borderRadius: 2,
//                   transition: "0.3s",
//                   "&:hover": {
//                     boxShadow: theme.shadows[10],
//                   },
//                 }}
//               >
//                 <Grid container spacing={3} alignItems="center">
//                   <Grid item xs={12} sm={4}>
//                     <Box
//                       component="img"
//                       src={`http://localhost:5000/products/${cart.productId.productImage}`}
//                       alt={cart.productName}
//                       sx={{
//                         width: "100%",
//                         borderRadius: 2,
//                         boxShadow: theme.shadows[4],
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={8}>
//                     <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                       {cart.productId.productName}
//                     </Typography>
//                     <Typography
//                       variant="h5"
//                       color="primary"
//                       sx={{ my: 2, fontWeight: 600 }}
//                     >
//                       Rs. {cart.productId.productPrice.toLocaleString()}
//                     </Typography>
//                     <Typography
//                       variant="body1"
//                       color="text.secondary"
//                       sx={{ mb: 2 }}
//                     >
//                       {cart.productId.productDescription}
//                     </Typography>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         mb: 2,
//                         background: theme.palette.grey[100],
//                         borderRadius: 1,
//                         p: 1,
//                         width: "fit-content",
//                       }}
//                     >
//                       <IconButton
//                         onClick={() =>
//                           handleQuantityChange(cart.quantity - 1, cart)
//                         }
//                         color="primary"
//                       >
//                         <Remove />
//                       </IconButton>
//                       <TextField
//                         size="small"
//                         value={cart.quantity}
//                         onChange={(e) =>
//                           handleQuantityChange(Number(e.target.value), cart)
//                         }
//                         sx={{
//                           width: 60,
//                           mx: 1,
//                           "& .MuiOutlinedInput-root": {
//                             bgcolor: "white",
//                           },
//                         }}
//                         inputProps={{
//                           min: 1,
//                           style: { textAlign: "center" },
//                         }}
//                       />
//                       <IconButton
//                         onClick={() =>
//                           handleQuantityChange(cart.quantity + 1, cart)
//                         }
//                         color="primary"
//                       >
//                         <Add />
//                       </IconButton>
//                     </Box>

//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography variant="h6" color="primary">
//                         Total: Rs. {cart.total.toLocaleString()}
//                       </Typography>
//                       <Button
//                         variant="outlined"
//                         color="error"
//                         startIcon={<Delete />}
//                         onClick={() => handleDeleteCartItem(cart._id)}
//                       >
//                         Remove
//                       </Button>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Paper>
//             ))}
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <Card elevation={5} sx={{ borderRadius: 2 }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
//                   Order Summary
//                 </Typography>

//                 <Box sx={{ my: 3 }}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       mb: 2,
//                     }}
//                   >
//                     <Typography variant="body1">Subtotal:</Typography>
//                     <Typography variant="body1" fontWeight="500">
//                       Rs. {subTotal.toLocaleString()}
//                     </Typography>
//                   </Box>

//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       mb: 2,
//                       alignItems: "center",
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <LocalShipping
//                         sx={{ mr: 1, color: theme.palette.primary.main }}
//                       />
//                       <Typography>Delivery Charge:</Typography>
//                     </Box>
//                     <Typography fontWeight="500">
//                       Rs. {deliveryCharge}
//                     </Typography>
//                   </Box>

//                   <Divider sx={{ my: 2 }} />

//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       mb: 3,
//                     }}
//                   >
//                     <Typography variant="h6">Total:</Typography>
//                     <Typography variant="h6" color="primary" fontWeight="600">
//                       Rs. {total.toLocaleString()}
//                     </Typography>
//                   </Box>

//                   <TextField
//                     fullWidth
//                     label="Delivery Address"
//                     variant="outlined"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     sx={{ mb: 3 }}
//                   />

//                   <Typography variant="h6" gutterBottom>
//                     Payment Method
//                   </Typography>

//                   <RadioGroup
//                     value={paymentMethod}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                   >
//                     <Paper sx={{ mb: 2, p: 1 }}>
//                       <FormControlLabel
//                         value="Khalti"
//                         control={<Radio />}
//                         label={
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <img
//                               src="assets/icons/khalti.png"
//                               alt="Khalti"
//                               style={{ width: 24, marginRight: 8 }}
//                             />
//                             <Typography>Khalti</Typography>
//                           </Box>
//                         }
//                       />
//                     </Paper>

//                     <Paper sx={{ p: 1 }}>
//                       <FormControlLabel
//                         value="Cash On Delivery"
//                         control={<Radio />}
//                         label={
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <img
//                               src="assets/icons/cod.png"
//                               alt="Cash on Delivery"
//                               style={{ width: 24, marginRight: 8 }}
//                             />
//                             <Typography>Cash On Delivery</Typography>
//                           </Box>
//                         }
//                       />
//                     </Paper>
//                   </RadioGroup>

//                   <Button
//                     fullWidth
//                     variant="contained"
//                     size="large"
//                     startIcon={<CreditCard />}
//                     onClick={handleBuyNow}
//                     sx={{
//                       mt: 3,
//                       py: 1.5,
//                       fontSize: "1.1rem",
//                       fontWeight: 600,
//                     }}
//                   >
//                     Place Order
//                   </Button>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       ) : (
//         <Paper
//           elevation={3}
//           sx={{
//             p: 6,
//             textAlign: "center",
//             borderRadius: 2,
//           }}
//         >
//           <ShoppingCart
//             sx={{
//               fontSize: 80,
//               color: theme.palette.grey[300],
//               mb: 2,
//             }}
//           />
//           <Typography variant="h5" color="text.secondary" gutterBottom>
//             Your cart is empty
//           </Typography>
//           <Typography color="text.secondary" mb={3}>
//             Discover our amazing collection of guitars and start shopping!
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             startIcon={<ShoppingBag />}
//             href="/userdashboard"
//           >
//             Continue Shopping
//           </Button>
//         </Paper>
//       )}

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//           severity={snackbar.severity}
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default Cart;

import DOMPurify from "dompurify";
import {
  Add,
  CreditCard,
  Delete,
  LocalShipping,
  Remove,
  ShoppingBag,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import {
  createOrderApi,
  deleteCartApi,
  getAllCartApi,
  updateCartApi,
  updateCartStatusApi,
} from "../../Apis/api";

const Cart = () => {
  const theme = useTheme();
  const [address, setAddress] = useState("KTM");
  const [paymentMethod, setPaymentMethod] = useState("Cash On Delivery");
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(50);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [change, setChange] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Sanitize input
  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const handleSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleQuantityChange = async (value, cart) => {
    if (value < 1) return;

    try {
      const updatedCartItems = cartItems.map((item) =>
        item._id === cart._id
          ? {
              ...item,
              quantity: value,
              total: item.productId.productPrice * value,
            }
          : item
      );
      setCartItems(updatedCartItems);

      const data = {
        quantity: value,
        total: cart.productId.productPrice * value,
      };

      await updateCartApi(cart._id, data);
      handleSnackbar("Cart updated successfully");
    } catch (err) {
      handleSnackbar(
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const handleDeleteCartItem = async (cartId) => {
    try {
      await deleteCartApi(cartId);
      setCartItems(cartItems.filter((item) => item._id !== cartId));
      handleSnackbar("Item deleted successfully");
    } catch (err) {
      handleSnackbar(
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getAllCartApi();
        setCartItems(res.data.carts);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        handleSnackbar("Failed to load cart items", "error");
      }
    };
    fetchCart();
  }, [change]);

  useEffect(() => {
    const total = cartItems.reduce((acc, cart) => acc + cart.total, 0);
    setSubTotal(total);
    setTotal(total + deliveryCharge);
  }, [cartItems, deliveryCharge, change]);

  const khaltiConfig = {
    publicKey: "test_public_key_0800545e039d45368cab4d1b2fb93d01",
    productIdentity: "1234567890",
    productName: "Guitar Purchase",
    productUrl: "http://localhost:3000/cart",
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
    eventHandler: {
      onSuccess(payload) {
        handlePayment();
        handleSnackbar("Payment successful");
      },
      onError(error) {
        handleSnackbar("Payment failed", "error");
      },
      onClose() {
        console.log("Payment widget closed");
      },
    },
  };

  const handleKhaltiPayment = () => {
    const sanitizedAddress = sanitizeInput(address);
    if (!sanitizedAddress.trim()) {
      handleSnackbar("Please enter your address", "error");
      return;
    }
    const checkout = new KhaltiCheckout(khaltiConfig);
    checkout.show({ amount: total * 100 });
  };

  const handlePayment = async () => {
    const sanitizedAddress = sanitizeInput(address);
    if (!sanitizedAddress.trim()) {
      handleSnackbar("Please enter your address", "error");
      return;
    }
    try {
      const data = {
        address: sanitizedAddress,
        carts: cartItems,
        totalAmount: total,
        paymentType: paymentMethod,
      };
      await createOrderApi(data);
      await updateCartStatusApi({ status: "ordered" });
      setChange(!change);
      handleSnackbar("Order placed successfully");
    } catch (err) {
      handleSnackbar(
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const handleBuyNow = () => {
    const sanitizedAddress = sanitizeInput(address);
    if (!sanitizedAddress.trim()) {
      handleSnackbar("Please enter your address", "error");
      return;
    }
    if (!paymentMethod) {
      handleSnackbar("Please select a payment method", "error");
      return;
    }
    if (paymentMethod === "Khalti") {
      handleKhaltiPayment();
    } else {
      handlePayment();
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
        <ShoppingBag sx={{ mr: 2 }} />
        Guitar Shopping Cart
      </Typography>

      {cartItems.length > 0 ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map((cart) => (
              <Paper
                key={cart._id}
                elevation={3}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: theme.shadows[10],
                  },
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <Box
                      component="img"
                      src={`http://localhost:5000/products/${cart.productId.productImage}`}
                      alt={cart.productName}
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {cart.productId.productName}
                    </Typography>
                    <Typography
                      variant="h5"
                      color="primary"
                      sx={{ my: 2, fontWeight: 600 }}
                    >
                      Rs. {cart.productId.productPrice.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {cart.productId.productDescription}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        background: theme.palette.grey[100],
                        borderRadius: 1,
                        p: 1,
                        width: "fit-content",
                      }}
                    >
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(cart.quantity - 1, cart)
                        }
                        color="primary"
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        size="small"
                        value={cart.quantity}
                        onChange={(e) =>
                          handleQuantityChange(Number(e.target.value), cart)
                        }
                        sx={{
                          width: 60,
                          mx: 1,
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "white",
                          },
                        }}
                        inputProps={{
                          min: 1,
                          style: { textAlign: "center" },
                        }}
                      />
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(cart.quantity + 1, cart)
                        }
                        color="primary"
                      >
                        <Add />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" color="primary">
                        Total: Rs. {cart.total.toLocaleString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteCartItem(cart._id)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={5} sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>

                <Box sx={{ my: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="body1">Subtotal:</Typography>
                    <Typography variant="body1" fontWeight="500">
                      Rs. {subTotal.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocalShipping
                        sx={{ mr: 1, color: theme.palette.primary.main }}
                      />
                      <Typography>Delivery Charge:</Typography>
                    </Box>
                    <Typography fontWeight="500">
                      Rs. {deliveryCharge}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary" fontWeight="600">
                      Rs. {total.toLocaleString()}
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    label="Delivery Address"
                    variant="outlined"
                    value={address}
                    onChange={(e) => setAddress(sanitizeInput(e.target.value))}
                    sx={{ mb: 3 }}
                  />

                  <Typography variant="h6" gutterBottom>
                    Payment Method
                  </Typography>

                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Paper sx={{ mb: 2, p: 1 }}>
                      <FormControlLabel
                        value="Khalti"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                              src="assets/icons/khalti.png"
                              alt="Khalti"
                              style={{ width: 24, marginRight: 8 }}
                            />
                            <Typography>Khalti</Typography>
                          </Box>
                        }
                      />
                    </Paper>

                    <Paper sx={{ p: 1 }}>
                      <FormControlLabel
                        value="Cash On Delivery"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <img
                              src="assets/icons/cod.png"
                              alt="Cash on Delivery"
                              style={{ width: 24, marginRight: 8 }}
                            />
                            <Typography>Cash On Delivery</Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </RadioGroup>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<CreditCard />}
                    onClick={handleBuyNow}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    Place Order
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
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
          <ShoppingCart
            sx={{
              fontSize: 80,
              color: theme.palette.grey[300],
              mb: 2,
            }}
          />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Discover our amazing collection of guitars and start shopping!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<ShoppingBag />}
            href="/userdashboard"
          >
            Continue Shopping
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

export default Cart;
