const express = require('express');
require('dotenv').config();
const cors = require("cors");

const { connect } = require('./config/database');

// NEW ROUTES
const publicBlogRoute = require("./routes/publicBlogRoute");
const adminBlogRoute = require("./routes/adminBlogRoute");

// OTHER EXISTING ROUTES 
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect DB
connect();

// PUBLIC BLOG APIs
app.use("/api/blogs", publicBlogRoute);

// ADMIN BLOG APIs
app.use("/api/admin/blogs", adminBlogRoute);

// ADMIN AUTH / LOGIN 
app.use("/api/admin", adminRouter);

// USERS
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
