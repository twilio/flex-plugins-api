module.exports = {
  collectCoverage: false,
  preset: 'ts-jest',
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  testMatch: ['<rootDir>/**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.js?$': '<rootDir>/node_modules/babel-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/*/index.ts',
    '<rootDir>/src/exceptions/*.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
