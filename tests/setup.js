// Test setup file
require('dotenv').config({ path: '.env.test' });

// Mock environment variables for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
process.env.ADMIN_ID = process.env.ADMIN_ID || 'admin@test.com';
process.env.ADMIN_KEY = process.env.ADMIN_KEY || 'test-password';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-test';

