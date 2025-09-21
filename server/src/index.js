const path = require("path");
require("dotenv").config({ path: path.resolve("src", "./.env") });
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");

const { verifyFirebaseToken } = require("./api/auth");
const middlewares = require("./middlewares");
const logs = require("./api/logs");
const app = express();

mongoose.connect(process.env.DATABASE_URL);
console.log(process.env.DATABASE_URL);
app.use(morgan("common"));
app.use(helmet());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://tarvel-log.vercel.app",
      // Allow all Vercel preview deployments for this project
      /^https:\/\/tarvel-.*-chris-arias-projects\.vercel\.app$/,
    ];

    const isAllowed = allowedOrigins.some((allowed) => {
      if (typeof allowed === "string") {
        return origin === allowed;
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "The end",
  });
});

app.use("/api/logs", verifyFirebaseToken, logs);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(process.env.DATABASE_URL);
});
