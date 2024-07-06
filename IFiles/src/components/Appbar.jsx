import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { baseurl, url } from "../utils/api";
import axios from "axios";
import {
  RemoveData,
  RetriveAccessToken,
  RetriveData,
  removeToken,
} from "../utils/localStorage";
import { showToast } from "../utils/toast";

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.user);
  const [anchorElUser, setAnchorElUser] = useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const refresh_token = RetriveData("login");
  const userLogout = async () => {
    const response = await axios.post(
      url.signout,
      { refresh_token },
      { headers: { Authorization: `Bearer ${RetriveAccessToken("user")}` } }
    );
    if (response?.data?.status === "success") {
      showToast("success", "Successfully logout");
      removeToken("user");
      RemoveData("login");
      navigate("/login");
    } else {
      showToast("error", "Something wentwrong");
    }
  };
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          py={2}
        >
          <Box display={"flex"} alignItems={"center"}>
            <AdbIcon sx={{ display: "flex", mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              FHUB
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Indra" src={`${baseurl}${user?.profilePic}`} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Typography textAlign="center">
                <Link
                  to={{
                    pathname: "/account",
                  }}
                >
                  {"Profile"}
                </Link>
              </Typography>
              <Typography
                textAlign="center"
                component={"button"}
                onClick={userLogout}
              >
                {"Logout"}
              </Typography>
            </Menu>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
