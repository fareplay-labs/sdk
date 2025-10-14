# 🚀 Quick Publish Guide

## Package Ready to Publish! ✅

**Package**: `@fareplay/sdk@1.0.0`  
**Size**: 20.4 kB (tarball) / 101 kB (unpacked)  
**Files**: 59 files (all dist/ contents + README + LICENSE)

---

## 🎯 Quick Steps to Publish

### 1️⃣ Login to npm (one-time)
```bash
npm login
```
Enter your npm credentials when prompted.

### 2️⃣ Check Login Status
```bash
npm whoami
```

### 3️⃣ Publish! 🚀
```bash
npm publish --access public
```

**Note**: `--access public` is required for scoped packages like `@fareplay/sdk`

---

## ⚠️ Important: Organization Access

The package name `@fareplay/sdk` requires access to the `@fareplay` npm organization.

### Option A: You Own @fareplay Organization
✅ Just run: `npm publish --access public`

### Option B: Need to Create @fareplay Organization
1. Go to: https://www.npmjs.com/org/create
2. Create organization named `fareplay`
3. Then publish

### Option C: Use Different Package Name
If you don't want to use a scoped package:

```bash
# Edit package.json, change:
"name": "@fareplay/sdk"
# to:
"name": "fareplay-sdk"

# Then publish:
npm publish
```

---

## 📦 What Gets Published

The tarball includes:
- ✅ All `/dist` files (56 files)
- ✅ `README.md`
- ✅ `LICENSE`
- ✅ `package.json`

The tarball **excludes** (via .npmignore):
- ❌ Source files (`/src`)
- ❌ Examples
- ❌ Documentation
- ❌ Tests
- ❌ Config files

---

## 🔄 For Future Updates

### Update Version
```bash
# Patch (1.0.0 → 1.0.1)
npm version patch

# Minor (1.0.0 → 1.1.0)
npm version minor

# Major (1.0.0 → 2.0.0)
npm version major
```

### Publish Update
```bash
npm publish
```

---

## ✅ Verify Publication

After publishing, check:

```bash
# View on npm
npm view @fareplay/sdk

# Test install
npm install @fareplay/sdk

# Visit package page
https://www.npmjs.com/package/@fareplay/sdk
```

---

## 🔐 2FA (Two-Factor Authentication)

If you have 2FA enabled (recommended):

```bash
npm publish --access public --otp=123456
```
Replace `123456` with your 6-digit authenticator code.

---

## 🤖 Automated Publishing (Optional)

GitHub Actions workflow is ready at:
`.github/workflows/publish.yml`

### Setup:
1. Create npm access token: https://www.npmjs.com/settings/tokens
2. Add to GitHub Secrets as `NPM_TOKEN`
3. Push a git tag to trigger:
   ```bash
   git tag v1.0.0
   git push --tags
   ```

---

## 🐛 Troubleshooting

### "You must be logged in"
```bash
npm login
```

### "You do not have permission to publish"
- You need access to `@fareplay` organization
- Or change package name (remove `@fareplay/` scope)

### "Package name already taken"
- Choose a different name in `package.json`

### "2FA required"
```bash
npm publish --access public --otp=YOUR_CODE
```

---

## 📊 Current Package Status

Run this to see what will be published:
```bash
npm pack --dry-run
```

Package contents verified ✅
- Total files: 59
- Package size: 20.4 kB
- All TypeScript declarations included
- Source maps included for debugging

**Ready to publish!** 🎉

