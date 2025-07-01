module.exports = {
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'main.js',
    '!**/node_modules/**',
    '!**/dist/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  verbose: true,
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
    }
  ]
};