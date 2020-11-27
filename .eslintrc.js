module.exports = {
  // Parser is needed to support optional chaining.
  parser: "@babel/eslint-parser",
  parserOptions: {
    babelOptions: {
      configFile: "./.babelrc",
    },
  },
  env: {
    browser: true,
  },
  extends: ["airbnb", "airbnb/hooks", "prettier", "prettier/react"],
  rules: {
    "react/jsx-filename-extension": "off",
    "react/prop-types": "off",
    "react/destructuring-assignment": "off",
    "jsx-a11y/label-has-associated-control": [
      "error",
      {
        assert: "either",
      },
    ],
  },
};
