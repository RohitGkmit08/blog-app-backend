const jwt = require('jsonwebtoken');
const { adminLogin } = require('../controllers/adminController');

describe('Authentication Module', () => {
  
  // TEST_CASE_10: Admin login with valid credentials
  test('TEST_CASE_10: Should return JWT token for valid admin credentials', async () => {
    const mockReq = {
      body: {
        email: process.env.ADMIN_ID || 'admin@test.com',
        password: process.env.ADMIN_KEY || 'test-password'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await adminLogin(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalled();
    const responseCall = mockRes.json.mock.calls[0][0];
    expect(responseCall.success).toBe(true);
    expect(responseCall.token).toBeDefined();
    
    // Verify token is valid JWT
    const decoded = jwt.verify(responseCall.token, process.env.JWT_SECRET);
    expect(decoded.email).toBe(mockReq.body.email);
    expect(decoded.role).toBe('admin');
  });

  // TEST_CASE_11: Admin login with invalid credentials
  test('TEST_CASE_11: Should return error for invalid credentials', async () => {
    const mockReq = {
      body: {
        email: 'wrong@example.com',
        password: 'wrong-password'
      }
    };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await adminLogin(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid credentials'
    });
  });

  // TEST_CASE_12: JWT token generation
  test('TEST_CASE_12: Should generate valid JWT token with correct payload', () => {
    const payload = { userId: '123', role: 'admin' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.userId).toBe('123');
    expect(decoded.role).toBe('admin');
    expect(decoded.exp).toBeDefined(); // Expiration timestamp
  });
});

