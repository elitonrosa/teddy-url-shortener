module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.service.(t|j)s',
    '**/*.controller.(t|j)s',
    '**/*.use-case.(t|j)s',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!(jose)/)'],
};
