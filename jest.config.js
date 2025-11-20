module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js', '**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'service/**/*.js',
    'utils/**/*.js',
    'middleware/**/*.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};

