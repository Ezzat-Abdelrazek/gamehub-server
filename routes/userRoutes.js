const express = require("express");
const router = express.Router();
const {
  getTopTenUsers,
  updateUserHighestScore,
} = require("../controllers/userControllers");

const { createUser } = require("../controllers/authControllers");
router.route("/").post(createUser);
router.route("/:id/score").post(updateUserHighestScore);
router.route("/top-ten").get(getTopTenUsers);

module.exports = router;
