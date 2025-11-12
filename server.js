const express = require("express");
require("dotenv").config();

const { connect } = require("./config/database"); 
const test = require("./routes/test"); // adjust path if needed

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// connect DB
connect();

// test route
app.use("/api/v1", test);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
