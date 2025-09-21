const { Router } = require("express");
const mongoose = require("mongoose");
const { verifyFirebaseToken } = require("./auth");
const LogEntry = require("../models/LogEntry"); //.. bc jump out and then go to models then logEntry

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const entries = await LogEntry.find({ uid: req.user.uid });
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const logEntry = new LogEntry({
      ...req.body,
      uid: req.user.uid,
    });
    const createdEntry = await logEntry.save();
    res.json(createdEntry);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    console.log("Attempting to delete ID:", req.params.id);
    console.log("Current DB:", mongoose.connection.name);
    const deletedEntry = await LogEntry.findOneAndDelete({
      _id: req.params.id,
      uid: req.user.uid,
    });
    if (!deletedEntry) {
      // does not exist then
      return res.status(404).json({ message: "Log entry not found" });
    }
    res.json(deletedEntry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
