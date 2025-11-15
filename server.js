const express = require('express');
require('dotenv').config();

const { connect } = require('./config/database');

const adminRouter = require('./routes/adminRoutes');
const blogRouter = require('./routes/blogRoutes');
const commentRouter = require('./routes/commentRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Connect DB
connect();

// Mount routes
app.use('/admin', adminRouter);
app.use('/', blogRouter);
app.use('/', commentRouter);
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

module.exports = app;
