const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    tokens: {
      access_token: {
        type: String,
        required: true,
      },
      refresh_token: {
        type: String,
        required: true,
      },
    },
    isBlacklist: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
