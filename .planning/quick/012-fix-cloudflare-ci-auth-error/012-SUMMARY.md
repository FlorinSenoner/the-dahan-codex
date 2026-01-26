# Quick Task 012: Fix Cloudflare CI Authentication Error

## Summary

Fixed CI deployment to Cloudflare Pages by:
1. Updating API token permissions (user action)
2. Migrating from deprecated `pages-action@v1` to `wrangler-action@v3`
3. Creating the Pages project via wrangler CLI

## Problem

CI deployment failing with multiple errors:
- **403 Authentication Error** - Token had Workers permissions, needed Pages Edit
- **404 Project Not Found** - `the-dahan-codex` project didn't exist in Cloudflare Pages

## Solution

### 1. API Token Permissions (User Action)
User updated `CLOUDFLARE_API_TOKEN` in GitHub secrets with a token that has:
- **Cloudflare Pages: Edit** permission (was Workers-only)

### 2. Migrate to wrangler-action@v3 (Code Change)
Replaced deprecated action:
```yaml
# Before (deprecated)
uses: cloudflare/pages-action@v1

# After (recommended)
uses: cloudflare/wrangler-action@v3
with:
  command: pages deploy dist --project-name=the-dahan-codex --commit-dirty=true
```

### 3. Project Creation (Temporary Step)
Added temporary step to create the project:
```yaml
- name: Create Cloudflare Pages project (if not exists)
  uses: cloudflare/wrangler-action@v3
  with:
    command: pages project create the-dahan-codex --production-branch=main
  continue-on-error: true
```
Removed after successful first deploy.

## Commits

| Hash | Message |
|------|---------|
| `71a3372` | fix(ci): migrate from deprecated pages-action to wrangler-action |
| `1080226` | fix(ci): add project creation step for Cloudflare Pages |
| `8b3f308` | chore(ci): remove project creation step (project now exists) |

## Outcome

- ✅ CI deploys to Cloudflare Pages successfully
- ✅ PRs get preview deployments automatically
- ✅ Using recommended `wrangler-action@v3`
