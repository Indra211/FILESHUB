import { Box, Stack, Typography } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { baseurl, url } from "../utils/api";
import axios from "axios";
import { showToast } from "../utils/toast";
import { RetriveAccessToken } from "../utils/localStorage";
export const FileChip = ({ item, files, setFiles }) => {
  const date = new Date(item?.createdAt);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  const access_token = RetriveAccessToken("user");
  const deleteFile = async () => {
    const updatedFiles = files?.filter((data) => item?._id !== data?._id);
    setFiles(updatedFiles);
    const response = await axios.delete(url.deleteFile(item?._id), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (response?.data?.status === "success") {
      showToast("success", response?.data?.message);
    }
  };
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      bgcolor={"whitesmoke"}
      mx={3}
      px={1}
      borderRadius={2}
      mb={0.1}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
        <ArticleIcon color="info" />
        <Typography>{item?.name}</Typography>
      </Stack>
      <Typography>{formattedDate}</Typography>
      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Typography
          sx={{ cursor: "pointer" }}
          p={1}
          component="a"
          target="_"
          href={`${baseurl}${item?.file}`}
        >
          <VisibilityIcon color="primary" />
        </Typography>
        <Typography
          sx={{ cursor: "pointer" }}
          p={1}
          component={"button"}
          onClick={deleteFile}
        >
          <DeleteIcon color="error" />
        </Typography>
      </Stack>
    </Box>
  );
};
