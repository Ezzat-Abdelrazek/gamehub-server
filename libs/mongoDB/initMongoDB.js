const mongoose = require("mongoose");

exports.initMongoDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const connectionString = process.env.MONGODO_URL.replace(
      "<password>",
      process.env.MONGODB_PASSWORD
    );

    await mongoose.connect(connectionString);
    mongoose.set("strictQuery", true);
    console.log(`Connected To MongoDB Successfully 🎉🎉🎉`);
  } catch (error) {
    console.log(error);
  }
};
