import { Box, Stack, Typography } from "@mui/material";
import ResponsiveAppBar from "../components/Appbar";
import { FileIconBtn } from "../components/FileIconBtn";
import { useEffect, useState } from "react";
import { UploadModal } from "../components/UploadModal";
import {
  RetriveAccessToken,
  RetriveData,
  StoreUserDataWithToken,
} from "../utils/localStorage";
import axios from "axios";
import { url } from "../utils/api";
import { FileChip } from "../components/fileChip";
import bg from "../assets/bg.jpg";
import { useNavigate } from "react-router-dom";

export const FileScreen = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [access_token, setAccess_Token] = useState(RetriveAccessToken("user"));
  const refresh_token = RetriveData("login");
  const [updateValue, setUpdateValue] = useState("");
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const fetchFiles = async () => {
      const response = await axios.get(url.getFiles, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setFiles(response?.data?.data);
    };
    fetchFiles();
  }, [updateValue, access_token]);
  const fetchNewAccessToken = async () => {
    try {
      const response = await axios.post(url.newAceesToken, { refresh_token });
      const token = response?.data?.access_token;
      if (token) {
        setAccess_Token(token);
        StoreUserDataWithToken("user", token);
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    const checkToken = async () => {
      if (refresh_token) {
        await fetchNewAccessToken();
      } else {
        navigate("/login");
      }
    };

    checkToken();
  }, [access_token]);
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
    >
      <ResponsiveAppBar />
      <Box mt={10}>
        {files?.length > 0 ? (
          files?.map((item, index) => (
            <FileChip
              key={index}
              item={item}
              files={files}
              setFiles={setFiles}
            />
          ))
        ) : (
          <Box
            mt={10}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Typography mx={2} color={"white"} variant="h2" fontSize={42}>
              FileHub - Simplify Your File Management
            </Typography>
            <Typography mx={2} color={"white"} variant="caption" fontSize={21}>
              FileHub is a powerful yet intuitive files management application
              that helps you organize, store, and access your files
              effortlessly. Whether you’re managing personal documents,
              collaborating on projects, or storing important data, FileHub
              offers robust features such as secure cloud storage, seamless file
              sharing, version control, and advanced search capabilities. Stay
              productive and organized with FileHub, your trusted partner in
              file management
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ position: "fixed", bottom: 12, right: 12 }}>
        <FileIconBtn onClick={() => setOpen(true)} />
      </Box>
      <UploadModal
        open={open}
        onClose={() => setOpen(false)}
        setUpdateValue={setUpdateValue}
      />
    </Box>
  );
};
