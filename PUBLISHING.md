# Publishing @fareplay/sdk to npm

## Prerequisites

### 1. Create an npm Account
If you don't have one already:
- Go to https://www.npmjs.com/signup
- Create an account
- Verify your email address

### 2. Enable 2FA (Two-Factor Authentication)
npm requires 2FA for publishing packages:
- Log into npmjs.com
- Go to Account Settings → Two-Factor Authentication
- Enable 2FA (recommended: use an authenticator app)

### 3. Check Package Name Availability
The package name `@fareplay/sdk` requires:
- **Organization**: You need access to the `@fareplay` npm organization
- **Or**: Change the package name to something available

Check availability:
```bash
npm search @fareplay/sdk
```

## Publishing Steps

### Step 1: Login to npm

```bash
npm login
```

You'll be prompted for:
- Username
- Password
- Email
- 2FA code (if enabled)

Verify you're logged in:
```bash
npm whoami
```

### Step 2: Create npm Organization (if needed)

If `@fareplay` organization doesn't exist:

**Option A: Create the organization**
```bash
# On npmjs.com
# Go to: https://www.npmjs.com/org/create
# Create organization named 'fareplay'
```

**Option B: Use unscoped package name**
Change `package.json`:
```json
{
  "name": "fareplay-sdk",  // instead of @fareplay/sdk
  // ... rest of config
}
```

### Step 3: Review package.json

Ensure these fields are correct:

```json
{
  "name": "@fareplay/sdk",
  "version": "1.0.0",
  "description": "Official FarePlay SDK for the Fare Protocol ecosystem",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "fareplay",
    "fare-protocol",
    "casino",
    "solana",
    "web3",
    "sdk"
  ],
  "author": "FarePlay",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/fareplay/sdk.git"
  },
  "bugs": {
    "url": "https://github.com/fareplay/sdk/issues"
  }
}
```

### Step 4: Test the Package Locally

```bash
# Create a tarball
npm pack

# This creates: fareplay-sdk-1.0.0.tgz
# Test it in another project:
cd /path/to/test-project
npm install /path/to/fareplay-sdk-1.0.0.tgz
```

### Step 5: Build the Package

```bash
# Ensure everything is built
npm run build

# Verify build output
ls -la dist/
```

### Step 6: Run Pre-publish Checks

```bash
# Type check
npm run typecheck

# Check what will be published
npm pack --dry-run

# Or use:
npm publish --dry-run
```

### Step 7: Publish to npm

**For First Release:**
```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (@fareplay/sdk) to make them publicly available.

**For Subsequent Releases:**
```bash
npm publish
```

### Step 8: Verify Publication

```bash
# Check on npm
npm view @fareplay/sdk

# Or visit:
# https://www.npmjs.com/package/@fareplay/sdk

# Install to test
npm install @fareplay/sdk
```

## Version Management

### Updating Versions

```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major

# Then publish
npm publish
```

### Pre-release Versions

```bash
# Alpha release
npm version 1.0.0-alpha.1
npm publish --tag alpha

# Beta release
npm version 1.0.0-beta.1
npm publish --tag beta

# Install pre-release
npm install @fareplay/sdk@alpha
```

## Troubleshooting

### Error: Package name already taken
```bash
# Option 1: Request access to @fareplay organization
# Contact organization owner

# Option 2: Choose different name
# Update package.json name field
```

### Error: You must be logged in
```bash
npm login
# Follow prompts
```

### Error: You do not have permission to publish
```bash
# You need to be added to @fareplay organization
# Or change package name
```

### Error: 2FA required
```bash
# Enable 2FA on npmjs.com
# Then publish with:
npm publish --otp=<6-digit-code>
```

## Best Practices

### 1. Pre-publish Checklist
- [ ] Update CHANGELOG.md
- [ ] Update version in package.json
- [ ] Run `npm run typecheck`
- [ ] Run `npm run build`
- [ ] Test locally with `npm pack`
- [ ] Commit all changes
- [ ] Create git tag: `git tag v1.0.0`
- [ ] Push tags: `git push --tags`

### 2. .npmignore vs files
Your `.npmignore` excludes source files. The `files` field in package.json specifies what to include:

```json
{
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### 3. Automated Publishing with CI/CD

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 4. Provenance (Recommended)

Publish with provenance for supply chain security:

```bash
npm publish --provenance --access public
```

This requires:
- Publishing from GitHub Actions
- Using npm 9.5.0+

## Quick Publish Commands

```bash
# One-time setup
npm login

# Every release
npm version patch              # or minor/major
npm run build
npm publish --access public

# Push git changes
git push
git push --tags
```

## Post-Publication

### Update Documentation
- Add npm badge to README.md:
  ```markdown
  ![npm version](https://img.shields.io/npm/v/@fareplay/sdk)
  ![npm downloads](https://img.shields.io/npm/dm/@fareplay/sdk)
  ```

### Announce Release
- Update GitHub releases
- Share on social media
- Update documentation sites

### Monitor
- Check download stats: https://npm-stat.com/charts.html?package=@fareplay/sdk
- Monitor issues: https://github.com/fareplay/sdk/issues
- Watch for security alerts

## Unpublishing (Emergency Only)

```bash
# Unpublish specific version (within 72 hours)
npm unpublish @fareplay/sdk@1.0.0

# Unpublish entire package (within 72 hours)
npm unpublish @fareplay/sdk --force

# Deprecate instead (preferred)
npm deprecate @fareplay/sdk@1.0.0 "Please upgrade to 1.0.1"
```

⚠️ **Warning**: Unpublishing is not recommended and has restrictions. Use deprecation instead.

## Additional Resources

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [npm Organizations](https://docs.npmjs.com/organizations)

