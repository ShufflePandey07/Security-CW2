import {
  CalendarToday,
  Circle,
  KeyboardArrowDown,
  KeyboardArrowUp,
  LocationOn,
  Payment,
  ShoppingBag,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { getUserOrdersApi } from "../../Apis/api";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const theme = useTheme();

  useEffect(() => {
    getUserOrdersApi()
      .then((res) => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "dispatched":
        return theme.palette.success.main;
      case "pending":
        return theme.palette.warning.main;
      case "cancelled":
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          bgcolor: "grey.50",
          minHeight: "100vh",
          py: 6,
          background: "linear-gradient(145deg, #f6f8ff 0%, #f0f4ff 100%)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              background: "linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Order History
          </Typography>
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={200}
              sx={{
                mb: 3,
                borderRadius: 2,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "grey.50",
        minHeight: "100vh",
        py: 6,
        background: "linear-gradient(145deg, #f6f8ff 0%, #f0f4ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{ mb: 6 }}
        >
          <ShoppingBag
            sx={{
              fontSize: 40,
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Order History
          </Typography>
        </Stack>

        {orders.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "background.paper",
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <ShoppingBag
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              When you make a purchase, your orders will appear here
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {orders.map((order) => (
              <MotionCard
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: theme.shadows[3],
                  "&:hover": {
                    boxShadow: theme.shadows[6],
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderBottom: expandedOrders[order._id] ? 1 : 0,
                    borderColor: "divider",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleOrderExpansion(order._id)}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Circle
                          sx={{
                            fontSize: 12,
                            color: getStatusColor(order.status),
                          }}
                        />
                        <Typography variant="subtitle1" fontWeight={600}>
                          #{order._id.slice(-8)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarToday
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Payment
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          Rs. {order.total}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(order.status)}15`,
                            color: getStatusColor(order.status),
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleOrderExpansion(order._id);
                          }}
                        >
                          {expandedOrders[order._id] ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                <Collapse in={expandedOrders[order._id]}>
                  <CardContent sx={{ bgcolor: "grey.50" }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Delivery Address
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                          >
                            <LocationOn
                              sx={{ color: "text.secondary", mt: 0.5 }}
                            />
                            <Typography variant="body2">
                              {order.address}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: "100%" }}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Payment Details
                          </Typography>
                          <Stack spacing={1}>
                            <Typography variant="body2">
                              Method: {order.paymentType}
                            </Typography>
                            <Typography variant="body2">
                              Total Amount: Rs. {order.total}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 2 }}>
                      Order Items
                    </Typography>
                    <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
                      {order.carts.map((item, index) => (
                        <React.Fragment key={item._id}>
                          <ListItem sx={{ px: 2, py: 1.5 }}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2">
                                  {item.productId.productName}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Qty: {item.quantity}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Rs. {item.total}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Chip
                                  label={item.status}
                                  size="small"
                                  sx={{
                                    bgcolor: `${getStatusColor(item.status)}15`,
                                    color: getStatusColor(item.status),
                                    textTransform: "capitalize",
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </ListItem>
                          {index < order.carts.length - 1 && (
                            <Divider sx={{ opacity: 0.5 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Collapse>
              </MotionCard>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default OrderList;
