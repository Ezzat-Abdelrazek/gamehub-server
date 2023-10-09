const express = require("express");
const AppError = require("./libs/utils/AppError");
const app = express();
const userRouter = require("./routes/userRoutes");
const mathGameRouter = require("./routes/mathGameRoutes");
const globalErrorHandler = require("./controllers/errorControllers");
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(express.json());

// MIDDLEWARES
app.use(
  cors({
    origin: ["https://gamehub-theta.vercel.app/", "https://gamehub-git-main-ezzat-abdelrazek.vercel.app/", "https://majestic-churros-1a7e73.netlify.app/games/quick-math"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/equation", mathGameRouter);

app.use("*", (req, res, next) => {
  next(new AppError("This route is not defined yet", 404));
});

app.use(globalErrorHandler);
module.exports = app;
