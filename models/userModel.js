const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  highestScore: {
    type: Number,
    default: 0,
  },
  fastestTime: {
    type: Number,
    default: 0,
  },
  latestSubmissionTime: {
    type: Number,
    default: 0,
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;

  return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
