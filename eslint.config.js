//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"
import pluginQuery from "@tanstack/eslint-plugin-query"
import pluginRouter from "@tanstack/eslint-plugin-router"
import reactHooks from "eslint-plugin-react-hooks"
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript"

export default [
  ...tanstackConfig,
  ...pluginQuery.configs["flat/recommended"],
  ...pluginRouter.configs["flat/recommended"],
  reactHooks.configs.flat["recommended-latest"],
  {
    settings: {
      // Without these, the import rules skip every .ts/.tsx dependency and
      // import/no-cycle never reports anything. The resolver reads the `@/*`
      // alias from tsconfig.json.
      "import-x/extensions": [".ts", ".tsx", ".js", ".jsx"],
      "import-x/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
      "import-x/resolver-next": [createTypeScriptImportResolver()],
    },
    rules: {
      "import/no-cycle": "error",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/auth/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@logto/*"],
              message:
                "Logto is isolated in src/lib/auth: go through AuthClient.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      "eslint.config.js",
      ".prettierrc",
      "src/routeTree.gen.ts",
      "src/components/ui/**",
    ],
  },
]
