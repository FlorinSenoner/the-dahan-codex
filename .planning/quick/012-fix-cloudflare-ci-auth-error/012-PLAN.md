---
phase: quick-012
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: []
autonomous: false

must_haves:
  truths:
    - "GitHub Actions deploy workflow succeeds without 403 error"
    - "Cloudflare Pages deployment completes"
  artifacts: []
  key_links:
    - from: "GitHub Actions"
      to: "Cloudflare API"
      via: "CLOUDFLARE_API_TOKEN secret"
      pattern: "cloudflare/pages-action"
---

<objective>
Fix CI deployment 403 authentication error by configuring Cloudflare API token with correct permissions in GitHub repository secrets.

Purpose: Enable automated deployments to Cloudflare Pages via GitHub Actions
Output: Working CI/CD pipeline that deploys to Cloudflare Pages on push to main
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.github/workflows/deploy.yml
</context>

<tasks>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 1: Create Cloudflare API Token with Pages permissions</name>
  <action>
    The 403 error indicates the CLOUDFLARE_API_TOKEN either doesn't exist or lacks proper permissions.

    **Step 1: Create a new API token in Cloudflare**

    1. Go to https://dash.cloudflare.com/profile/api-tokens
    2. Click "Create Token"
    3. Use the "Edit Cloudflare Workers" template OR create a custom token with:
       - **Account > Cloudflare Pages** - Edit
       - **Account > Account Settings** - Read
       - **Zone > Zone** - Read (optional, for custom domains)
    4. Set Account Resources to: Include > "your-account-name"
    5. Click "Continue to summary" then "Create Token"
    6. **Copy the token immediately** (it won't be shown again)

    **Step 2: Verify the project name**

    1. Go to https://dash.cloudflare.com > Workers & Pages
    2. Find your Pages project and verify it's named exactly: `the-dahan-codex`
    3. If it doesn't exist, create it via: Workers & Pages > Create > Pages > Connect to Git
  </action>
  <verify>
    - API token created and copied
    - Project "the-dahan-codex" exists in Cloudflare Pages
  </verify>
  <done>Cloudflare API token with Pages edit permission created</done>
  <resume-signal>Type "token created" when you have the API token copied</resume-signal>
</task>

<task type="checkpoint:human-action" gate="blocking">
  <name>Task 2: Configure GitHub repository secrets</name>
  <action>
    **Add/Update secrets in GitHub:**

    1. Go to https://github.com/[your-username]/the-dahan-codex/settings/secrets/actions
    2. Click "New repository secret" (or update existing)
    3. Add secret:
       - **Name:** `CLOUDFLARE_API_TOKEN`
       - **Value:** (paste the token from Task 1)
    4. Verify `CLOUDFLARE_ACCOUNT_ID` exists:
       - If missing, find it in Cloudflare: dash.cloudflare.com > right sidebar shows Account ID
       - Add as secret if needed
  </action>
  <verify>
    Both secrets configured:
    - CLOUDFLARE_API_TOKEN (new token from Task 1)
    - CLOUDFLARE_ACCOUNT_ID (32-character hex string)
  </verify>
  <done>GitHub secrets configured with valid Cloudflare credentials</done>
  <resume-signal>Type "secrets configured" when both secrets are set</resume-signal>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Verify deployment succeeds</name>
  <what-built>Cloudflare API token and GitHub secrets configuration</what-built>
  <how-to-verify>
    1. Go to https://github.com/[your-username]/the-dahan-codex/actions
    2. Find the most recent failed "Deploy" workflow run
    3. Click "Re-run all jobs"
    4. Wait for the workflow to complete
    5. Verify:
       - "Deploy to Cloudflare Pages" step succeeds (green checkmark)
       - Deployment URL is shown in the workflow output
       - Site is accessible at the deployment URL
  </how-to-verify>
  <resume-signal>Type "deployment working" or describe any remaining errors</resume-signal>
</task>

</tasks>

<verification>
- GitHub Actions "Deploy" workflow completes successfully
- No 403 authentication errors in the "Deploy to Cloudflare Pages" step
- Site is deployed and accessible
</verification>

<success_criteria>
- CI pipeline deploys to Cloudflare Pages without authentication errors
- Future pushes to main automatically deploy
</success_criteria>

<output>
After completion, create `.planning/quick/012-fix-cloudflare-ci-auth-error/012-SUMMARY.md`
</output>
