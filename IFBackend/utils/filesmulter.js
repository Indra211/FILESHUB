const multer = require("multer");
const path = require("path");
const fs = require("fs");

const parentUploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(parentUploadDir)) {
  fs.mkdirSync(parentUploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log(file);
    const uploadDir = path.join(parentUploadDir, req.user.username);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
