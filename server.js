const express = require("express");
require("dotenv").config();
const { connect } = require("./config/database");
const adminRouter = require("./routes/adminRoutes");

const app = express();

// middleware
app.use(express.json());


// mount admin routes
app.use("/api/v1/admin", adminRouter);

const port = process.env.PORT || 3000;

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  })
  .catch(() => {
    console.error("Server not started due to DB connection failure");
  });

module.exports = app;
