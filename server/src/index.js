require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

const middlewares = require("./middlewares");
const logs = require("./api/logs");
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/posts");

app.use(morgan("common"));
app.use(helmet());
app.use(cors());
console.log("CORS Origin:", process.env.CORS_ORIGIN);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hello Worldfd",
  });
});

app.use("/api/logs", logs);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
