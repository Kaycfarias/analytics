# Setting up npm Trusted Publishing for Trackly

## Quick Guide

### 1. Login to npm

Visit: https://www.npmjs.com/login

### 2. Configure Trusted Publishing for trackly-sdk

1. Go to: https://www.npmjs.com/package/trackly-sdk/access
2. Scroll to **Trusted publishers**
3. Click **Add trusted publisher**
4. Fill in:
   - **Provider**: GitHub
   - **Repository owner**: kaycfarias
   - **Repository**: trackly
   - **Workflow**: publish.yml
   - **Environment**: (leave empty or use `production`)
5. Click **Add**

### 3. Configure Trusted Publishing for trackly-react

1. Go to: https://www.npmjs.com/package/trackly-react/access
2. Scroll to **Trusted publishers**
3. Click **Add trusted publisher**
4. Fill in:
   - **Provider**: GitHub
   - **Repository owner**: kaycfarias
   - **Repository**: trackly
   - **Workflow**: publish.yml
   - **Environment**: (leave empty)
5. Click **Add**

### 4. Verify Setup

On each package page, you should see:

- ✅ "GitHub Actions from kaycfarias/trackly can publish to this package"

## First Publish Note

⚠️ **Important**: For the **first publish** of new packages, you'll need to either:

**Option A**: Publish manually first time

```bash
cd packages/sdk
npm publish --access public
cd ../react
npm publish --access public
```

**Option B**: Use automation token for first publish only, then enable Trusted Publishing

## Benefits

- ✅ No `NPM_TOKEN` secret needed
- ✅ Automatic OIDC authentication
- ✅ More secure (tokens can't leak)
- ✅ Full audit trail via provenance
- ✅ Easy to revoke access (just remove from npm settings)

## Testing

After setup, create a test tag:

```bash
git tag v0.1.0-test
git push origin v0.1.0-test
```

Watch the workflow at: https://github.com/kaycfarias/trackly/actions

## Troubleshooting

### "403 Forbidden" error during publish

**Cause**: Trusted publishing not configured or package doesn't exist yet.

**Solution**:

1. Verify trusted publisher is added in npm.com
2. If package doesn't exist, do first manual publish
3. Ensure repository/workflow names match exactly

### "OIDC token verification failed"

**Cause**: Workflow configuration mismatch

**Solution**:

- Check workflow name is exactly `publish.yml`
- Verify repository is `kaycfarias/trackly`
- Ensure `id-token: write` permission is set (already configured)

## Documentation

- npm Trusted Publishers: https://docs.npmjs.com/generating-provenance-statements
- GitHub OIDC: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect
