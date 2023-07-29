// const express = require("express");
// const mongoose = require("mongoose");
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
// const dotenv = require("dotenv");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const userRoute = require("./routes/users");
// const authRoute = require("./routes/auth");
// const businessRoute = require("./routes/business");

import userRoute from "./routes/user.route.js";
import authRoute from "./routes/auth.route.js";
import bizRoute from "./routes/business.route.js";
// import orderRoute from "./routes/order.route.js";
// import conversationRoute from "./routes/conversation.route.js";
// import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);


dotenv.config();


const connect = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};
// mongoose.connect(
//   process.env.CONNECTION_STRING,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     console.log("Connected to MongoDB");
//   }
// );

//middleware
// app.use(express.json());
// app.use(helmet());
// app.use(morgan("common"));

// app.use("/api/users", userRoute);
// app.use("/api/auth", authRoute);
// app.use("/api/business", businessRoute);

// app.listen(3300, () => {
//   console.log("Backend server is running!");
// });

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/biz", bizRoute);
// app.use("/api/orders", orderRoute);
// app.use("/api/conversations", conversationRoute);
// app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(3300, () => {
  connect();
  console.log("Backend server is running!");
});