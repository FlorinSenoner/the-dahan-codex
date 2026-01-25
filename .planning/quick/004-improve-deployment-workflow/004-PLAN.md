# Quick Task 004: Improve Deployment Workflow

## Goal

Upgrade CI/CD workflows to match dinochron patterns: separate deploy.yml, secrets validation, PR previews, Convex deployment.

## Tasks

### Task 1: Create deploy.yml with full deployment features
- Secrets/variables validation with format checking
- Convex codegen and function deployment
- Production deployment (main branch push)
- PR preview deployments with URL comments
- Proper permissions (contents: read, deployments: write, pull-requests: write)

### Task 2: Simplify ci.yml to pure CI
- Remove deploy job from ci.yml
- Keep lint, typecheck, build, and tests
- Use vars.* for non-sensitive values instead of secrets.*

### Task 3: Document required GitHub configuration
- Create DEPLOYMENT.md with setup instructions

## Success Criteria
- [ ] deploy.yml created with validation, Convex deploy, PR previews
- [ ] ci.yml simplified to CI-only
- [ ] Documentation for GitHub/Cloudflare setup
