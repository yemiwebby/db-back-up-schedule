const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");
require("dotenv").config();
require("dotenv").config({ path: "/home/circleci/projec/.env" });

const app = express();

app.use(express.json());

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://yemiwebby:dinner2158@scheduledb.uggj7.mongodb.net/companiesdb?retryWrites=true&w=majority";
mongoose.connect(uri, {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(Router);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server for the app is running at port 3000");
});
