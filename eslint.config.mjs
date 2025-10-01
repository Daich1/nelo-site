import eslintPluginNext from "@next/eslint-plugin-next";
import tseslint from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["node_modules"],
  },
  {
    plugins: {
      "@typescript-eslint": tseslint,
      "@next/next": eslintPluginNext,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // anyを許可
      "react-hooks/exhaustive-deps": "warn",       // useEffect依存は警告
      "@next/next/no-img-element": "warn",         // imgタグも警告
    },
  },
];
