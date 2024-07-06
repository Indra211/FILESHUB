const mongoose = require("mongoose");

const filesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide name"],
    },
    file: {
      type: String,
      required: [true, "please provide file"],
    },
    size: Number,
    user: {
      type: String,
      ref: "Login",
      required: [true, "Please provide a login reference"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userfiles", filesSchema);
