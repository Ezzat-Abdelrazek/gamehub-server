const mongoose = require("mongoose");

const equationSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Equation is required"],
  },
  answer: {
    type: Number,
    required: [true, "Answer is required"],
  },
});

const Equation = mongoose.model("equation", equationSchema);

module.exports = Equation;
