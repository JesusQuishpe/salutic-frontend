const RULES={
  OFF:"off",
  WARN:"warn",
  ON:"on"
}

module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard',
    'prettier'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    "react/jsx-no-target-blank":RULES.WARN,
    "spaced-comment":RULES.OFF,
    "react/react-in-jsx-scope":RULES.OFF,
    "react/prop-types":RULES.OFF
  }
}
