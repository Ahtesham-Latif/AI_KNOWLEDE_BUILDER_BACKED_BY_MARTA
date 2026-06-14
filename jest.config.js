/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^jspdf$': '<rootDir>/node_modules/jspdf/dist/jspdf.umd.min.js'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, diagnostics: false }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jspdf|html2canvas|fflate)/)'
  ],
  projects: [
    {
      displayName: 'api',
      testMatch: ['<rootDir>/tests/**/*.test.ts'],
      testEnvironment: 'node',
      preset: 'ts-jest/presets/default-esm',
      extensionsToTreatAsEsm: ['.ts'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { useESM: true, diagnostics: false }],
      },
    },
    {
      displayName: 'ui',
      testMatch: ['<rootDir>/ui.test.tsx'],
      testEnvironment: 'jsdom',
      preset: 'ts-jest/presets/default-esm',
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^jspdf$': '<rootDir>/node_modules/jspdf/dist/jspdf.umd.min.js'
      },
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { useESM: true, diagnostics: false }],
      },
      transformIgnorePatterns: [
        'node_modules/(?!(jspdf|html2canvas|fflate)/)'
      ],
    }
  ]
};