// IMPORTANT: If Jest is not picking up this config, rename this file to jest.config.cjs
module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-leaflet|@react-leaflet|react-error-boundary|leaflet)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react-leaflet$': '<rootDir>/__mocks__/react-leaflet.js',
    '^react-leaflet/(.*)$': '<rootDir>/__mocks__/react-leaflet.js'
  }
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
