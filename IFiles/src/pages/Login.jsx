import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { showToast } from "../utils/toast";
import axios from "axios";
import { url } from "../utils/api";
import { StoreLocal, StoreUserDataWithToken } from "../utils/localStorage";
import bg from "../assets/bg.jpg";

export const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });
  const [signupFormData, setSignUpFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleLoginForm = (e) => {
    setLoginFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSignUpForm = (e) => {
    setSignUpFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const userLogin = async () => {
    try {
      const response = await axios.post(url.signin, loginFormData);
      if (response?.data?.status === "success") {
        StoreLocal("login", response?.data?.data?.refresh_token);
        StoreUserDataWithToken("user", response?.data?.data?.access_token);
        navigate("/");
      } else {
        showToast("error", response.data.message);
      }
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const userSignUp = async () => {
    try {
      const response = await axios.post(url.signup, signupFormData);
      if (response?.data?.status === "success") {
        StoreLocal("login", response?.data?.data?.refresh_token);
        StoreUserDataWithToken("user", response?.data?.data?.access_token);
        navigate("/");
      } else {
        showToast("error", response.data.message);
      }
    } catch (err) {
      showToast("error", err.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    isSignUp ? userSignUp() : userLogin();
  };
  return (
    <Stack
      width={"100vw"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
            p: 2,
            borderRadius: 4,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignUp ? "Sign Up" : "Login In"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              value={
                !isSignUp ? loginFormData.username : signupFormData.username
              }
              onChange={!isSignUp ? handleLoginForm : handleSignUpForm}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            {isSignUp && (
              <TextField
                margin="normal"
                required
                fullWidth
                value={signupFormData.email}
                onChange={handleSignUpForm}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              value={
                !isSignUp ? loginFormData.password : signupFormData.password
              }
              onChange={!isSignUp ? handleLoginForm : handleSignUpForm}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, alignSelf: "center" }}
            >
              Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item xs>
                <Link
                  onClick={() => setIsSignUp(!isSignUp)}
                  variant="body2"
                  sx={{ cursor: "pointer" }}
                >
                  {isSignUp
                    ? "Already have an account? Login"
                    : "Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Stack>
  );
};
