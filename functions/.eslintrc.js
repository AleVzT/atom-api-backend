module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: ["./tsconfig.json"],
      tsconfigRootDir: __dirname,
      sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
      "plugin:prettier/recommended",
    ],
    ignorePatterns: [".eslintrc.js", "lib/", "dist/"],
    rules: {},
  };
  