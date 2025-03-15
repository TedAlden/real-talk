export default {
  preset: "@shelf/jest-mongodb",
  collectCoverageFrom: [
    "src/**/*.js",
    "!**/*.test.js",
    "!**/tests/**",
    "!**/testUtils.js",
    "!**/node_modules/**",
  ],
  watchPathIgnorePatterns: ["globalConfig"],
  coverageReporters: ["lcov", "text"],
};
