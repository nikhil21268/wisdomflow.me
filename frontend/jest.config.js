module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  roots: ['<rootDir>/tests']
};
