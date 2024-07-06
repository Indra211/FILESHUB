const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const LoginSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
      minlength: [8, "Username must be at least 8 characters long"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter a email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [8, "password must be at least 8 characters long"],
      maxlength: [16, "password must be less than 16 character long"],
      select: false,
    },
  },
  { timestamps: true }
);

LoginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});
LoginSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const UserInfSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: [true, "Please provide a login reference"],
    },
    profilePic: String,
    DOB: String,
  },
  { timestamps: true }
);

module.exports = {
  LoginSchema: mongoose.model("Login", LoginSchema),
  UserInfSchema: mongoose.model("UserInfo", UserInfSchema),
};
