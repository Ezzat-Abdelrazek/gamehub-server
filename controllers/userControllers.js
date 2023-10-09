const User = require("../models/userModel");
const catchAsync = require("../libs/utils/catchAsync");

exports.getTopTenUsers = catchAsync(async (req, res) => {
  const users = await User.find().sort("-points").limit(10);
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.updateUserHighestScore = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) throw new AppError("No user found", 404);

  if (user.highestScore < req.body.score) {
    user.highestScore = req.body.score;
    await user.save();
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
