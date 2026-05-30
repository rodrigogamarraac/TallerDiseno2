module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: ["<rootDir>/src/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "src/logica/**/*.js",
  ],
};