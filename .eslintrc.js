module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "jest"],
  extends: ["airbnb-base"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    quotes: [2, "double", { avoidEscape: true }],
    indent: [2, 2, { SwitchCase: 1 }],
    "consistent-return": "off",
    // overwritting AirBnB styleguide because this doesn<t play well with eslint-prettier
    // "operator-linebreak": [2, "after", { overrides: { "?": "after" } }],
    "class-methods-use-this": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "explicit",
        overrides: {
          constructors: "no-public",
        },
      },
    ],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["error", { allow: ["constructors"] }],
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "import/no-extraneous-dependencies": "off",
    "object-curly-newline": ["error", { ObjectPattern: { multiline: true } }],
    "no-unused-expressions": ["error", { allowShortCircuit: true, allowTernary: true }],
    "no-use-before-define": "off",
    "no-underscore-dangle": "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
