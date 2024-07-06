const mongoose = require("mongoose");
const { LoginSchema, UserInfSchema } = require("./models");
const express = require("express");
const CustomResponse = require("../../utils/response");
const {
  generateTokens,
  protect,
} = require("../../middlewares/Protect/protect");
const TokenSchema = require("../../middlewares/Protect/schema");
const userroute = express.Router();
const upload = require("../../utils/filesmulter");

userroute.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const usernameChk = (await LoginSchema.countDocuments({ username })) > 0;
    if (usernameChk) {
      return CustomResponse(res, 200, "error", "Username already exists", "");
    }
    const emailChk = (await LoginSchema.countDocuments({ email })) > 0;
    if (emailChk) {
      return CustomResponse(res, 200, "error", "email already exists", "");
    }
    const newUser = await LoginSchema.create({ username, password, email });
    const tokens = generateTokens({ id: newUser._id, username });
    await TokenSchema.create({ tokens: tokens });
    return CustomResponse(res, 201, "success", "Succesfully created", {
      id: newUser._id,
      username: newUser.username,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
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
});

userroute.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userChk = await LoginSchema.countDocuments({ username });
    if (userChk < 1) {
      return CustomResponse(res, 200, "error", "No Account Found", "");
    }
    const user = await LoginSchema.findOne({ username }).select("password");
    if (!user || !(await user.comparePassword(password))) {
      return CustomResponse(res, 400, "error", "Inavlid credentials");
    }
    const data = { id: user._id, username };
    const tokens = generateTokens(data);
    await TokenSchema.create({ tokens: tokens });
    return CustomResponse(res, 200, "success", "Successfully login", {
      id: data.id,
      username,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
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
});

userroute.post("/logout", protect, async (req, res) => {
  try {
    const { refresh_token } = req.body;
    await TokenSchema.findOneAndUpdate(
      { "tokens.refresh_token": refresh_token },
      { $set: { isBlacklist: true } },
      { new: true }
    );
    return CustomResponse(res, 200, "success", "Succesfully loged out", "");
  } catch (err) {
    return CustomResponse(
      res,
      500,
      "error",
      "something went wrong",
      err.message
    );
  }
});
userroute.post(
  "/save-user-data",
  protect,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const { name, DOB } = req.body;
      const profilePic = req.file
        ? `/uploads/${req.user.username}/${req.file.filename}`
        : null;
      const userchk = await UserInfSchema.countDocuments({ user: req.user.id });
      if (userchk > 0) {
        const update = {
          name: name,
          DOB: DOB,
          user: req.user.id,
        };
        if (profilePic) {
          update["profilePic"] = profilePic;
        }
        const userData = await UserInfSchema.findOneAndUpdate(
          {
            user: req.user.id,
          },
          { $set: update }
        );
        return CustomResponse(
          res,
          200,
          "success",
          "Succesfully updated",
          userData.name
        );
      }
      const userData = await UserInfSchema.create({
        name: name,
        profilePic: profilePic,
        DOB: DOB,
        user: req.user.id,
      });
      return CustomResponse(
        res,
        201,
        "success",
        "Succesfully created",
        userData.name
      );
    } catch (err) {
      return CustomResponse(
        res,
        500,
        "error",
        "something went wrong",
        err.message
      );
    }
  }
);

userroute.get("/get-user", protect, async (req, res) => {
  try {
    const user = await UserInfSchema.findOne({ user: req.user.id }).populate(
      "user",
      "email username"
    );
    return CustomResponse(res, 200, "success", "Succesfully created", user);
  } catch (err) {
    return CustomResponse(
      res,
      500,
      "error",
      "something went wrong",
      err.message
    );
  }
});

module.exports = userroute;
