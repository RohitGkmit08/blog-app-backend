require('dotenv').config();
const express = require('express');
const cors = require("cors");

const { connect } = require('./config/database');

// NEW ROUTES
const publicBlogRoute = require("./routes/publicBlogRoute");
const adminBlogRoute = require("./routes/adminBlogRoute");
const subscriberRoutes = require("./routes/subscriberRoutes");
const submissionRoutes = require("./routes/submissionRoutes");

const { sendEmail } = require("./service/sendEmail.js");


// OTHER EXISTING ROUTES 
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const commentRouter = require('./routes/commentRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const allowedOrigins = process.env.CORS_ORIGINS.split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);





app.use(express.json());
app.use(express.json());

// TEST EMAIL ROUTE
app.get("/test-mail", async (req, res) => {
  try {
    const result = await sendEmail(
      "test@mailtrap.io",
      "Mailtrap Test Email",
      "<h1>Hello from Mailtrap!</h1>"
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Connect DB
connect();

// PUBLIC BLOG APIs
app.use("/api/blogs", publicBlogRoute);

// COMMENTS (PUBLIC)  ← ADD THIS
app.use("/api/comments", commentRouter);

// ADMIN BLOG APIs
app.use("/api/admin/blogs", adminBlogRoute);

// ADMIN AUTH / LOGIN 
app.use("/api/admin", adminRouter);

// SUBSCRIBERS
app.use("/api/subscribers", subscriberRoutes);

// SUBMISSIONS
app.use("/api/submissions", submissionRoutes);

// USERS
app.use("/api/users", userRouter);


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});


