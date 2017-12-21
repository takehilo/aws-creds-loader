module.exports = {
  root: true,
  env: {
    mocha: true
  },
  extends: [
    'standard'
  ],
  plugins: [
    'chai-friendly'
  ],
  globals: {
    expect: true
  },
  rules: {
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2
  }
}
