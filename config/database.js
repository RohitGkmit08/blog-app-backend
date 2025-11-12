
const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected successfully"))
    .catch((err) => {
      console.error("DB connection failed:", err.message);
      process.exit(1);
    });
};
