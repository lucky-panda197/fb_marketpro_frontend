import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authLogoutUser, logoutUser } from "features/auth/authSlice";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { HiOutlineLogout, HiMenu } from "react-icons/hi";
import { SiCoderwall } from "react-icons/si";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    dispatch(authLogoutUser());
    dispatch(logoutUser());
    handleMenuClose();
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h6"
        component={Link}
        to="/"
        sx={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
      >
        FB MarketPro
      </Typography>
      {isAuthenticated && (
        <>
          <IconButton
            aria-label="menu"
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            color="inherit"
          >
            <HiMenu />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/vps">
              <SiCoderwall style={{ marginRight: "10px" }} /> VPS Management
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/group">
              <SiCoderwall style={{ marginRight: "10px" }} /> Group Management
            </MenuItem>
            <MenuItem onClick={handleMenuClose} component={Link} to="/ads">
              <SiCoderwall style={{ marginRight: "10px" }} /> Advertise Management
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>
              <HiOutlineLogout style={{ marginRight: "10px" }} /> Logout
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
}

export default Navbar;
