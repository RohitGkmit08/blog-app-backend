const express = require("express");
require("dotenv").config();
const { connect } = require("./config/database");
const adminRouter = require("./routes/adminRoutes");
const blogRouter = require("./routes/blogRoutes");

const app = express();

// middleware for JSON APIs
app.use(express.json());

// mount admin routes
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/blog", blogRouter);

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
