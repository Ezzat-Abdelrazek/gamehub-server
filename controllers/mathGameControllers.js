const AppError = require("../libs/utils/AppError");
const catchAsync = require("../libs/utils/catchAsync");
const Equation = require("../models/equationModel");
const User = require("../models/userModel");

function calculateScore(timeTaken) {
  if (timeTaken < 4) {
    return 100; // Correct answer in under 4 seconds
  } else if (timeTaken < 6) {
    return 80; // Correct answer in 4 - 6 seconds
  } else if (timeTaken < 8) {
    return 60; // Correct answer in 6 - 8 seconds
  } else if (timeTaken < 10) {
    return 40; // Correct answer in 8 - 10 seconds
  } else {
    return 20; // Takes over 10 seconds to answer
  }
}

exports.getRandomEquation = catchAsync(async (req, res, next) => {
  const count = await Equation.estimatedDocumentCount();
  const equation = await Equation.findOne()
    .skip(Math.floor(Math.random() * count))
    .select("-answer");

  if (!equation) throw new AppError("No equation found", 404);

  res.status(200).json({
    status: "success",
    data: {
      equation,
    },
  });
});

exports.confirmAnswer = catchAsync(async (req, res, next) => {
  const { answer, timeTaken, userId } = req.body;
  const { id } = req.params;
  const equation = await Equation.findById(id);
  if (!equation) throw new AppError("No equation found", 404);
  const correct = equation.answer === Number(answer);

  let score = 0;

  if (correct) {
    score = calculateScore(timeTaken);
  }

  const user = await User.findById(userId);

  if (user.fastestTime === 0 || timeTaken < user.fastestTime) {
    user.fastestTime = timeTaken;
    await user.save();
  }

  res.status(200).json({
    status: "success",
    data: {
      score,
    },
  });
});
