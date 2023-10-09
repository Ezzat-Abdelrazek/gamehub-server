const User = require("../models/userModel");
const catchAsync = require("../libs/utils/catchAsync");
const AppError = require("../libs/utils/AppError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const sendToken = (user, res) => {
  const token = signup(user._id);

  res.cookie("token", token, {
    secure: process.env.NODE_ENV === "production" ? true : false,
  });

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
};

const signup = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createUser = catchAsync(async (req, res) => {
  if (!req.body.username || !req.body.password)
    throw new AppError("Username and password are required", 400);

  const user = await User.findOne({
    username: req.body.username,
  });

  if (user) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password)
      throw new AppError("Username and password are required", 400);

    if (!user.comparePassword(password))
      throw new AppError(
        "The entered password is incorrect, please try again.",
        401
      );

    sendToken(user, res);
  } else {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    sendToken(newUser, res);
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    throw new AppError(
      "You are not logged in, Please log in and try again",
      401
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) throw new AppError("User does not exist", 401);

  req.user = user;
  next();
});
