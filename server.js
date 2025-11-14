const express = require("express");
require("dotenv").config();

const { connect } = require("./config/database");

const adminRouter = require("./routes/adminRoutes");
const blogRouter = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect DB
connect();

// Routes
app.use("/admin", adminRouter);
app.use("/blogs", blogRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
