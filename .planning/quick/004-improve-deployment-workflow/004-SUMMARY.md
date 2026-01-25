# Quick Task 004: Improve Deployment Workflow - Summary

## Changes Made

### 1. Created `.github/workflows/deploy.yml`
New dedicated deployment workflow with:
- **Secrets validation** - Fails fast with clear error messages if secrets/variables are missing or invalid
- **Format validation** - Checks VITE_CONVEX_URL and VITE_CLERK_PUBLISHABLE_KEY formats
- **Convex deployment** - Deploys Convex functions before building the app
- **Production deployment** - Deploys to Cloudflare Workers on push to main
- **PR preview deployments** - Creates preview deployments for pull requests
- **PR commenting** - Automatically comments preview URL on PRs

### 2. Simplified `.github/workflows/ci.yml`
- Removed deploy job (now in separate file)
- Changed `secrets.*` to `vars.*` for non-sensitive VITE_* values
- CI now focuses only on: lint, typecheck, build, e2e tests

---

## GitHub Configuration Required

### Repository Settings > Secrets and variables > Actions

#### Secrets (sensitive, encrypted)

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `CONVEX_DEPLOY_KEY` | Convex deploy key for CI/CD | Convex Dashboard > Project Settings > Deploy Key |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | Cloudflare Dashboard > My Profile > API Tokens > Create Token |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Cloudflare Dashboard > Workers & Pages > Overview (right sidebar) |

#### Variables (non-sensitive, visible in logs)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CONVEX_URL` | Your Convex deployment URL | `https://REDACTED.convex.cloud` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | `pk_test_...` or `pk_live_...` |

---

## Cloudflare Configuration Required

### 1. Create API Token

1. Go to **Cloudflare Dashboard** > **My Profile** > **API Tokens**
2. Click **Create Token**
3. Use the **Edit Cloudflare Workers** template, or create custom with:
   - **Account** > **Workers Scripts** > **Edit**
   - **Zone** > **Workers Routes** > **Edit** (if using custom domain)
4. Copy the token and save as `CLOUDFLARE_API_TOKEN` secret in GitHub

### 2. Get Account ID

1. Go to **Cloudflare Dashboard** > **Workers & Pages**
2. Look in the right sidebar for **Account ID**
3. Copy and save as `CLOUDFLARE_ACCOUNT_ID` secret in GitHub

### 3. Update Preview URL (optional)

In `.github/workflows/deploy.yml`, line ~98, update the preview URL subdomain:
```javascript
const previewUrl = `https://the-dahan-codex-pr-${prNumber}.<your-subdomain>.workers.dev`;
```

Replace `<your-subdomain>` with your actual Cloudflare Workers subdomain (found in Workers & Pages > Overview).

---

## Convex Configuration Required

### 1. Get Deploy Key

1. Go to **Convex Dashboard** > Your Project > **Settings**
2. Find **Deploy Key** section
3. Generate or copy the deploy key
4. Save as `CONVEX_DEPLOY_KEY` secret in GitHub

---

## How It Works

```
Push to main:
  CI workflow      --> lint, typecheck, build, e2e tests
  Deploy workflow  --> validate secrets --> deploy Convex --> build --> deploy to Cloudflare

Pull Request:
  CI workflow      --> lint, typecheck, build, e2e tests
  Deploy workflow  --> validate secrets --> deploy Convex --> build --> deploy preview --> comment URL on PR
```

---

## Migration Notes

If you had these as secrets previously, you need to:

1. **Delete old secrets**: `VITE_CONVEX_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
2. **Create new variables**: `VITE_CONVEX_URL`, `VITE_CLERK_PUBLISHABLE_KEY` (under Variables tab, not Secrets)

The `CLERK_SECRET_KEY` is no longer needed for this workflow (it was unused).
