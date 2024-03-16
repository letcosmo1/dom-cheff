require('dotenv').config({ path: '.env.test' });
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
      "^.+\\.tsx?$": "ts-jest"
  },
  moduleNameMapper: {
      '\\.(gif|ttf|eot|svg|png)$': '<rootDir>//src//__test__//mocks//fileMock.ts',
      '\\.(css|less|sass|scss)$': '<rootDir>//src//__test__//mocks//fileMock.ts',
      '^import.meta.env$': '<rootDir>//src//__test__//mocks//mockEnv.ts'
  },
  setupFiles: [
    'dotenv/config'
  ],
}