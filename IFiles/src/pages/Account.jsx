import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RetriveAccessToken } from "../utils/localStorage";
import axios from "axios";
import { baseurl, url } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../redux";
import { showToast } from "../utils/toast";
import bg from "../assets/bg.jpg";
export const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.user);
  const [update, setUpdate] = useState("");
  const access_token = RetriveAccessToken("user");
  useEffect(() => {
    if (!access_token) {
      navigate("/");
    }
  }, []);
  const fetchUserData = async () => {
    const response = await axios.get(url.getuser, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    dispatch(addUserData(response?.data?.data));
    const user = response?.data?.data;
    setUserData({
      profilePic: user?.profilePic,
      name: user?.name,
      DOB: user?.DOB,
    });
  };
  useEffect(() => {
    fetchUserData();
  }, [update]);
  const [userData, setUserData] = useState({
    profilePic: undefined,
    name: "",
    DOB: "",
  });
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (file) => {
    if (file) {
      const reader = new FileReader();
      console.log(reader.result);
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("profilePic", userData.profilePic);
      formData.append("name", userData.name);
      formData.append("DOB", userData.DOB);
      const response = await axios.post(url.saveUser, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (response?.data?.status === "success") {
        setUpdate((prev) => (prev += "aa"));
        showToast("success", "Succesfully Updated");
        setImageUrl("");
      }
    } catch (err) {
      console.log("Error uploading file:", err.message);
    }
  };
  return (
    <Box
      sx={{
        backgroundImage: `url(${bg})`,
        scrollbarWidth: "none",
        scrollBehavior: "smooth",
        backgroundAttachment: "fixed",
      }}
      overflow={"scroll"}
      height={"100vh"}
      width={"100vw"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        component={"form"}
        onSubmit={handleSubmit}
        mx={2}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        bgcolor={"whitesmoke"}
        p={2}
        borderRadius={8}
      >
        <IconButton
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              console.log(e.target.files[0]);
              setUserData((prev) => ({
                ...prev,
                profilePic: e.target.files[0],
              }));
              handleFileChange(e.target.files[0]);
            }}
          />
          <Avatar
            src={!imageUrl ? `${baseurl}${userData.profilePic}` : imageUrl}
          />
        </IconButton>
        <Typography>{user?.user?.username}</Typography>
        <Typography>{user?.user?.email}</Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          value={userData?.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          type="date"
          fullWidth
          value={userData?.DOB}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, DOB: e.target.value }))
          }
          id="dob"
          label="DOB"
          name="dob"
          autoComplete="dob"
          autoFocus
        />
        <Button type="submit" variant="contained" sx={{ alignSelf: "center" }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};
