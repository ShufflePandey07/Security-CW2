import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";

import {
  createProductApi,
  deleteProductApi,
  getOrdersApi,
  getProductsApi,
  updateOrderStatusApi,
  updateProductApi,
} from "../../Apis/api";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const OrderStatus = styled(Chip)(({ status }) => {
  const getColor = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return { bg: "#FFF4E5", color: "#B76E00" };
      case "dispatched":
        return { bg: "#E8F4FD", color: "#0060B9" };
      case "delivered":
        return { bg: "#E6F4EA", color: "#1E8E3E" };
      default:
        return { bg: "#F5F5F5", color: "#666666" };
    }
  };
  return {
    backgroundColor: getColor().bg,
    color: getColor().color,
    fontWeight: 600,
  };
});

const AdminDashboard = () => {
  const [gadgets, setGadgets] = useState([]);
  const [filteredGadgets, setFilteredGadgets] = useState([]);
  const [currentGadget, setCurrentGadget] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("laptop");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        getProductsApi(),
        getOrdersApi(),
      ]);
      setGadgets(productsRes.data.products);
      setFilteredGadgets(productsRes.data.products);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const sanitizedSearchTerm = DOMPurify.sanitize(searchTerm.toLowerCase());
    const results = gadgets.filter(
      (gadget) =>
        gadget.productName.toLowerCase().includes(sanitizedSearchTerm) ||
        gadget.productCategory.toLowerCase().includes(sanitizedSearchTerm)
    );
    setFilteredGadgets(results);
  }, [searchTerm, gadgets]);

  const handleAddGadget = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", DOMPurify.sanitize(name));
    formData.append("productPrice", DOMPurify.sanitize(price));
    formData.append("productCategory", DOMPurify.sanitize(category));
    formData.append("productDescription", DOMPurify.sanitize(description));
    formData.append("productImage", imageFile);

    try {
      const res = await createProductApi(formData);
      if (res.status === 201) {
        await fetchData();
        resetForm();
      }
    } catch (error) {
      console.error("Error adding gadget:", error);
    }
  };

  const handleEditGadget = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", DOMPurify.sanitize(name));
    formData.append("productPrice", DOMPurify.sanitize(price));
    formData.append("productCategory", DOMPurify.sanitize(category));
    formData.append("productDescription", DOMPurify.sanitize(description));
    if (imageFile) {
      formData.append("productImage", imageFile);
    }

    try {
      const res = await updateProductApi(currentGadget._id, formData);
      if (res.status === 201) {
        await fetchData();
        resetForm();
      }
    } catch (error) {
      console.error("Error updating gadget:", error);
    }
  };

  const handleDeleteGadget = async (id) => {
    const sanitizedId = DOMPurify.sanitize(id);
    if (window.confirm("Are you sure you want to delete this gadget?")) {
      try {
        const res = await deleteProductApi(sanitizedId);
        if (res.status === 201) {
          await fetchData();
        }
      } catch (error) {
        console.error("Error deleting gadget:", error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const sanitizedOrderId = DOMPurify.sanitize(orderId);
      const sanitizedStatus = DOMPurify.sanitize(newStatus);
      const response = await updateOrderStatusApi(sanitizedOrderId, {
        status: sanitizedStatus,
      });
      if (response.status === 200) {
        await fetchData();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const openEditModal = (gadget) => {
    setCurrentGadget(gadget);
    setName(DOMPurify.sanitize(gadget.productName));
    setDescription(DOMPurify.sanitize(gadget.productDescription));
    setPrice(DOMPurify.sanitize(gadget.productPrice.toString()));
    setCategory(DOMPurify.sanitize(gadget.productCategory));
    setImageFile(null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentGadget(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("laptop");
    setImageFile(null);
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2", mb: 4 }}>
        <Container>
          <Typography variant="h5" sx={{ py: 2 }}>
            Gadget Admin Dashboard
          </Typography>
        </Container>
      </AppBar>

      <Container>
        <Grid container spacing={3}>
          {/* Gadget Management Section */}
          <Grid item xs={12}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <TextField
                size="small"
                placeholder="Search gadgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
              >
                Add New Gadget
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGadgets.map((gadget) => (
                    <TableRow key={gadget._id}>
                      <TableCell>
                        {DOMPurify.sanitize(gadget.productName)}
                      </TableCell>
                      <TableCell>
                        ${DOMPurify.sanitize(gadget.productPrice.toString())}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={DOMPurify.sanitize(gadget.productCategory)}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => openEditModal(gadget)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteGadget(gadget._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Orders Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order Management
            </Typography>
            <Grid container spacing={2}>
              {orders.map((order) => (
                <Grid item xs={12} md={6} lg={4} key={order._id}>
                  <StyledCard>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          Order #{DOMPurify.sanitize(order._id.slice(-6))}
                        </Typography>
                        <OrderStatus
                          label={DOMPurify.sanitize(order.status)}
                          status={order.status}
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Customer:{" "}
                        {DOMPurify.sanitize(order.userId?.fullname || "N/A")}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Total: Rs.{DOMPurify.sanitize(order.total.toFixed(2))}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Payment: {DOMPurify.sanitize(order.paymentType)}
                      </Typography>
                      <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order._id, e.target.value)
                          }
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="dispatched">Dispatched</MenuItem>
                          <MenuItem value="delivered">Delivered</MenuItem>
                        </Select>
                      </FormControl>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Add/Edit Gadget Modal */}
        <Dialog open={isModalOpen} onClose={resetForm} maxWidth="sm" fullWidth>
          <DialogTitle>
            {currentGadget ? "Edit Gadget" : "Add New Gadget"}
            <IconButton
              onClick={resetForm}
              sx={{ position: "absolute", right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <form onSubmit={currentGadget ? handleEditGadget : handleAddGadget}>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="electric">Electric</MenuItem>
                  <MenuItem value="acoustic">Acoustic</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={resetForm}>Cancel</Button>
              <Button type="submit" variant="contained">
                {currentGadget ? "Update Gadget" : "Add Gadget"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
