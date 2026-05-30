module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  collectCoverageFrom: [
    "src/utilidades/**/*.js",
  ],
  coverageReporters: ["text", "lcov", "html"],
};
