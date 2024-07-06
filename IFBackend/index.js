const express = require("express");
const util = require("util");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const userroute = require("./apps/UserData/routes");
const { tokenrouter } = require("./middlewares/Protect/protect");
const fileroute = require("./apps/Files/routes");
const cors = require("cors");

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json({ limit: "100mb" }));
const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};
mongoose
  .connect(process.env.DB_STR, clientOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./logger.txt"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));
const PORT = process.env.PORT;
const apiPath = "/api/v1";

app.use(apiPath, userroute);
app.use(apiPath, tokenrouter);
app.use(apiPath, fileroute);
app.use(`${apiPath}/uploads`, express.static(path.join(__dirname, "uploads")));

app.listen(PORT, "0.0.0.0", () => {
  console.log("server is runing at port " + PORT);
});
