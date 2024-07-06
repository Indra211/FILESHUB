const jwt = require("jsonwebtoken");
const util = require("util");
const TokenSchema = require("./schema");
const tokenrouter = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();

exports.protect = async (req, res, next) => {
  try {
    const testToken = req.headers.authorization;

    if (!testToken || !testToken.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Please Provide Authentication Details",
      });
    }

    const token = testToken.split(" ")[1];

    const tokenChk = await TokenSchema.findOne({
      "tokens.access_token": token,
      isBlacklist: true,
    });
    if (tokenChk) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    const decodeToken = await util.promisify(jwt.verify)(
      token,
      process.env.ACCESS_SECRET_STR
    );

    if (!decodeToken) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
    req.user = decodeToken.user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: err.message,
    });
  }
};

exports.generateTokens = (data) => {
  const access_token = jwt.sign(
    { user: data, type: "access" },
    process.env.ACCESS_SECRET_STR,
    {
      expiresIn: process.env.ACCESS_TOKEN_VALID,
    }
  );
  const refresh_token = jwt.sign(
    { user: data, type: "refresh" },
    process.env.REFRESH_SECRET_STR,
    {
      expiresIn: process.env.REFRESH_TOKEN_VALID,
    }
  );
  return { access_token, refresh_token };
};

tokenrouter.post("/generate_access_token", async (req, res) => {
  const { refresh_token } = req.body;
  const decodeToken = await util.promisify(jwt.verify)(
    refresh_token,
    process.env.REFRESH_SECRET_STR
  );
  if (!decodeToken) {
    return res.status(401).json({
      access_token: false,
    });
  }
  const data = decodeToken.user;
  const access_token = jwt.sign(
    { user: data, type: "access" },
    process.env.ACCESS_SECRET_STR,
    {
      expiresIn: process.env.ACCESS_TOKEN_VALID,
    }
  );
  if (access_token) {
    await TokenSchema.findOneAndUpdate(
      { "tokens.refresh_token": refresh_token },
      { $set: { "tokens.access_token": access_token } },
      { new: true }
    );
  }
  return res.status(200).json({ access_token });
});
module.exports = {
  protect: exports.protect,
  generateTokens: exports.generateTokens,
  tokenrouter,
};
