const { protect } = require("../../middlewares/Protect/protect");
const upload = require("../../utils/filesmulter");
const CustomResponse = require("../../utils/response");
const fileroute = require("express").Router();
const filesSchema = require("./models");

fileroute.post(
  "/post-file",
  protect,
  upload.array("files"),
  async (req, res) => {
    try {
      if (!req.files) {
        return CustomResponse(res, 400, "error", "No file uploaded", "");
      }
      const filesData = req.files.map((file) => ({
        name: file.originalname,
        user: req.user.username,
        file: `/uploads/${req.user.username}/${file.filename}`,
        size: file.size,
      }));
      const files = await filesSchema.insertMany(filesData);
      const fileIds = files.map((file) => file._id);
      return CustomResponse(res, 201, "success", "successfully uploaded", {
        id: fileIds,
      });
    } catch (err) {
      return CustomResponse(
        res,
        500,
        "error",
        "Something went wrong",
        err.message
      );
    }
  }
);

fileroute.get("/get-files", protect, async (req, res) => {
  try {
    const { search } = req.query;
    if (search) {
      const files = await filesSchema.find({
        user: req.user.username,
        name: { $regex: search, $options: "i" },
      });
      return CustomResponse(res, 200, "success", "Succesfully fetched", files);
    }
    const files = await filesSchema.find({ user: req.user.username });
    return CustomResponse(res, 200, "success", "Succesfully fetched", files);
  } catch (err) {
    return CustomResponse(
      res,
      500,
      "error",
      "Something went wrong",
      err.message
    );
  }
});

fileroute.delete("/delete-file", protect, async (req, res) => {
  const { file_id } = req.query;
  try {
    await filesSchema.findByIdAndDelete(file_id);
    return CustomResponse(res, 200, "success", "Succesfully deleted", "");
  } catch (err) {
    return CustomResponse(
      res,
      500,
      "error",
      "Something went wrong",
      err.message
    );
  }
});

module.exports = fileroute;
