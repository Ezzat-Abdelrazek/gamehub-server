const express = require("express");
const { protect } = require("../controllers/authControllers");
const {
  getRandomEquation,
  confirmAnswer,
} = require("../controllers/mathGameControllers");

const router = express.Router();
router.route("/").get(protect, getRandomEquation);
router.route("/confirm/:id").post(confirmAnswer);

module.exports = router;
