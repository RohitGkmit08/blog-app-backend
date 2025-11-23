require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const publicBlogRoute = require('./routes/publicBlogRoute');
const adminBlogRoute = require('./routes/adminBlogRoute');
const subscriberRoutes = require('./routes/subscriberRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const commentRouter = require('./routes/commentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Health check route
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Public blog routes
app.use('/api/blogs', publicBlogRoute);

// Comment routes (public)
app.use('/api/comments', commentRouter);

// Admin blog routes (protected)
app.use('/api/admin/blogs', adminBlogRoute);

// Admin routes (login + protected routes)
app.use('/api/admin', adminRouter);

// Subscriber routes
app.use('/api/subscribers', subscriberRoutes);

// Submission routes
app.use('/api/submissions', submissionRoutes);

// User routes
app.use('/api/users', userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

