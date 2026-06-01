# Dev tooling — clean code + auto build verification

Optional but recommended. Run once.

## 1. Add dev dependencies

```bash
npm install --save-dev \
  husky \
  lint-staged \
  prettier \
  prettier-plugin-tailwindcss
```

## 2. Initialize Husky

```bash
npx husky init
# Creates .husky/ directory and pre-commit hook
```

Replace `.husky/pre-commit` contents with:

```sh
npx lint-staged
```

## 3. Add lint-staged config

Append to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "next lint --fix --file",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

## 4. What you get

```
Every git commit:
  ├─ Stage TS/TSX files
  ├─ Run next lint --fix on them
  ├─ Run prettier --write
  └─ Re-stage formatted version
  → only clean code can be committed

Every git push:
  ├─ GitHub Actions ci.yml fires
  ├─ npm ci (clean install)
  ├─ tsc --noEmit (type check)
  └─ next build (full production build)
  → catches build-breaking errors before Vercel deploy

You'll see a green ✓ or red ✗ next to every commit on GitHub.
```

## 5. Manual commands

```bash
# Run prettier on entire codebase once
npx prettier --write "**/*.{ts,tsx,json,md}"

# Run Next ESLint manually
npm run lint           # add this to scripts if not present
```

## 6. Optional — VS Code

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Install VS Code extensions: ESLint, Prettier.

---

## Quick-start (TL;DR)

```bash
# 1. Install
npm i -D husky lint-staged prettier prettier-plugin-tailwindcss

# 2. Husky hook
npx husky init
echo "npx lint-staged" > .husky/pre-commit

# 3. Add to package.json (manual edit):
# "lint-staged": { "*.{ts,tsx,js,jsx}": ["next lint --fix --file", "prettier --write"] }

# 4. Test
git add . && git commit -m "test: dev tooling"
# Should auto-format on commit
```

GitHub Actions ci.yml is already in place at `.github/workflows/ci.yml`. It runs on every push automatically.
