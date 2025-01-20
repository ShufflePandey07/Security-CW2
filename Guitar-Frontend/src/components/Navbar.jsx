import {
  AccountCircle,
  Close as CloseIcon,
  Favorite,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ListAlt,
  Logout,
  Menu as MenuIcon,
  Person,
  ShoppingCart,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const open = Boolean(anchorEl);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const menuItems = [
    { text: "Profile", icon: <Person />, link: "/profile" },
    { text: "Cart", icon: <ShoppingCart />, link: "/cart" },
    { text: "Favourites", icon: <Favorite />, link: "/favourites" },
    { text: "My Orders", icon: <ListAlt />, link: "/orderlist" },
  ];

  // Admin view
  if (user && user.role === "admin") {
    return (
      <Box sx={{ textAlign: "right", p: 2 }}>
        <Button variant="outlined" color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    );
  }

  return (
    <AppBar position="sticky" color="default" elevation={2}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Link to="/landingpage" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src="./../assets/icons/guitar.png"
              alt="Gadget Mart"
              sx={{
                height: 50,
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            <Button
              component={NavLink}
              to="/userdashboard"
              color="inherit"
              sx={{
                "&.active": {
                  color: "primary.main",
                  borderBottom: 2,
                  borderColor: "primary.main",
                },
              }}
            >
              Shop
            </Button>
            <Button
              component={NavLink}
              to="/about"
              color="inherit"
              sx={{
                "&.active": {
                  color: "primary.main",
                  borderBottom: 2,
                  borderColor: "primary.main",
                },
              }}
            >
              About Us
            </Button>
            <Button
              component={NavLink}
              to="/contact"
              color="inherit"
              sx={{
                "&.active": {
                  color: "primary.main",
                  borderBottom: 2,
                  borderColor: "primary.main",
                },
              }}
            >
              Contact Us
            </Button>
          </Box>

          {/* User Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  size="large"
                  sx={{ ml: 1 }}
                >
                  {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  sx={{ mt: 1 }}
                >
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.text}
                      component={Link}
                      to={item.link}
                      onClick={handleClose}
                      sx={{
                        gap: 1,
                        minWidth: 200,
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {item.icon}
                      <Typography>{item.text}</Typography>
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      gap: 1,
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    <Logout />
                    <Typography>Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="primary"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </Box>
            )}

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              sx={{ display: { md: "none" } }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "100%",
            boxSizing: "border-box",
          },
        }}
      >
        <List sx={{ pt: 8 }}>
          <ListItem
            button
            component={NavLink}
            to="/userdashboard"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={NavLink}
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ListItemText primary="About Us" />
          </ListItem>
          <ListItem
            button
            component={NavLink}
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ListItemText primary="Contact Us" />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
