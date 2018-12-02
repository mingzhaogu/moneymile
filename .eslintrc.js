module.exports = {
  env: {
    node: true
  },
  extends: ["eslint:recommended", "prettier"],
  globals: {
    artifacts: false,
    assert: false,
    contract: false
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  plugins: [],
  rules: {
    camelcase: [
      "error",
      {
        properties: "always"
      }
    ]
  }
}
