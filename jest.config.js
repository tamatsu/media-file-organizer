module.exports = {
  roots: ['<rootDir>/tests', '<rootDir>/renderer'],
  testMatch: ['**/__tests__/**/*.(js|jsx|ts|tsx)', '**/*.(test|spec).(js|jsx|ts|tsx)'],
  collectCoverageFrom: ['main.js', 'renderer/utils/**/*.js', '!**/node_modules/**', '!**/dist/**'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
  moduleDirectories: ['node_modules', '<rootDir>'],
  projects: [
    {
      displayName: 'main',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/unit/main.test.js'],
      setupFiles: ['<rootDir>/tests/setup-main.js']
    },
    {
      displayName: 'renderer',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/unit/renderer.test.js']
    },
    {
      displayName: 'sorting-filtering',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/unit/sorting-filtering.test.js']
    },
    {
      displayName: 'ui-integration',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/integration/ui.test.js']
    },
    {
      displayName: 'thumbnail',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/tests/unit/thumbnail.test.js']
    }
  ]
};
