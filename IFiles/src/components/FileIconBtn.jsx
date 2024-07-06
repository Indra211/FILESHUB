import { FileUpload } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export const FileIconBtn = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} sx={{ background: "#4ba5fa" }} color="#fff">
      <FileUpload sx={{ fontSize: 24, color: "#fff" }} />
    </IconButton>
  );
};
