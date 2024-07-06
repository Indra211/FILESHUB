import { Box, Button, Chip, Input, Modal, Stack } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { url } from "../utils/api";
import { showToast } from "../utils/toast";
import { RetriveAccessToken } from "../utils/localStorage";

export const UploadModal = ({ open, onClose, setUpdateValue }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const access_token = RetriveAccessToken("user");
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 10) {
      setError("You can upload up to 10 files at a time.");
    } else {
      setFiles(selectedFiles);
      setError("");
    }
  };

  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      if (Array.isArray(files)) {
        files.forEach((file) => {
          formData.append("files", file);
        });

        const response = await axios.post(url.postFile, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        });
        setUpdateValue((prev) => prev + "aa");
        onClose();
        return showToast("success", "sucessfully uploaded");
      }
      showToast("error", "please select files");
    } catch (err) {
      console.log("Error uploading file:", err.message);
    }
  };

  console.log(files);

  // const uploadAllFiles = async () => {
  //   if (files) {
  //     for (const item of files) {
  //       await uploadFiles(item);
  //     }
  //     setUpdateValue((prev) => prev + "aa");
  //     onClose();
  //     return showToast("success", "sucessfully uploaded");
  //   }
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    // uploadAllFiles();
    uploadFiles();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component={"form"}
        sx={{ ...style, gap: 4, display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit}
      >
        <Box>
          <Input
            type="file"
            inputProps={{ multiple: true }}
            onChange={handleFileChange}
          />
          {error && <Box sx={{ color: "red", mt: 2 }}>{error}</Box>}
        </Box>
        <Stack spacing={1}>
          <FileChip files={files} setFiles={setFiles} />
        </Stack>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const FileChip = ({ files, setFiles }) => {
  const handleDelete = (index) => {
    setFiles((data) => data?.filter((_, ind) => index !== ind));
  };
  return (
    <>
      {files?.map((item, index) => (
        <Chip label={item?.name} onDelete={() => handleDelete(index)} />
      ))}
    </>
  );
};
