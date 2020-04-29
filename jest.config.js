module.exports = {
  collectCoverage: false,
  preset: 'ts-jest',
  collectCoverageFrom: ['<rootDir>/**/*.ts'],
  testMatch: ['<rootDir>/**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.js?$': '<rootDir>/node_modules/babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
