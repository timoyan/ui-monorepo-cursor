# pnpm Overrides Best Practices

This guide explains how to ensure no stale versions exist after adding pnpm overrides.

## Quick Start

After adding or modifying a pnpm override in `package.json`:

```bash
# Option 1: Use the convenience script
pnpm run clean-install

# Option 2: Manual steps
rm -rf node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install

# Verify the override is applied
pnpm run verify-overrides
```

## Why Clean Installation is Needed

When you add or modify a pnpm override, existing `node_modules` and the lockfile may contain cached versions that don't respect the new override. To ensure the override is applied correctly:

1. **Remove all node_modules** - This clears cached package versions
2. **Remove pnpm-lock.yaml** - This forces pnpm to recalculate dependencies with the new override
3. **Reinstall** - This installs packages with the override applied

## Step-by-Step Process

### 1. Add the Override

Edit `package.json` in the root of your monorepo:

```json
{
  "pnpm": {
    "overrides": {
      "package-name": ">=1.2.3"
    }
  }
}
```

### 2. Clean Install

**Recommended approach (uses script):**
```bash
pnpm run clean-install
```

**Manual approach:**
```bash
# Remove all node_modules directories
rm -rf node_modules
rm -rf packages/*/node_modules

# Remove the lockfile
rm pnpm-lock.yaml

# Reinstall with the new override
pnpm install
```

### 3. Verify the Override

**Check a specific package:**
```bash
pnpm why package-name
```

**Verify all overrides:**
```bash
pnpm run verify-overrides
```

**Check for duplicate versions:**
```bash
pnpm dedupe
```

## Verification Methods

### Method 1: Using `pnpm why`

Shows all instances of a package and their versions:

```bash
pnpm why happy-dom
```

Look for all instances to ensure they match your override constraint.

### Method 2: Using the Verification Script

The `verify-overrides` script automatically checks all packages in your `pnpm.overrides`:

```bash
# Check all overrides
pnpm run verify-overrides

# Check a specific package
node scripts/verify-overrides.js happy-dom
```

### Method 3: Using `pnpm list`

List all versions of a package:

```bash
pnpm list --depth=Infinity package-name
```

### Method 4: Using `pnpm dedupe`

Ensures there are no duplicate versions:

```bash
pnpm dedupe
```

If duplicates exist, it will show them and you may need to run `pnpm install` again.

## Common Issues and Solutions

### Issue: Override Not Applied

**Symptoms:**
- `pnpm why` shows old versions
- Verification script reports errors

**Solution:**
1. Ensure you've removed `node_modules` and `pnpm-lock.yaml`
2. Run `pnpm install` again
3. Verify with `pnpm run verify-overrides`

### Issue: Multiple Versions Still Exist

**Symptoms:**
- `pnpm why` shows multiple different versions
- `pnpm dedupe` reports duplicates

**Solution:**
1. Check your override constraint (e.g., `>=1.2.3` allows multiple versions)
2. If you need a specific version, use exact version: `"1.2.3"` instead of `">=1.2.3"`
3. Run `pnpm dedupe` to consolidate versions
4. If issues persist, use `pnpm.overrides` with a more specific constraint

### Issue: Override Conflicts with Peer Dependencies

**Symptoms:**
- Installation fails with peer dependency warnings
- Some packages don't install

**Solution:**
1. Check if the override version is compatible with peer dependencies
2. Adjust the override constraint to be compatible
3. Consider using `peerDependencyRules` in `package.json` if needed

## Best Practices

1. **Always clean install after adding/modifying overrides**
   - Use `pnpm run clean-install` for convenience

2. **Verify immediately after installation**
   - Run `pnpm run verify-overrides` to ensure everything is correct

3. **Use specific version constraints when possible**
   - `">=1.2.3"` allows multiple versions
   - `"1.2.3"` forces exact version
   - `">=1.2.3 <1.3.0"` allows patch updates only

4. **Document why overrides are needed**
   - Add comments in `package.json` or document in `SECURITY.md`
   - Reference security advisories or compatibility issues

5. **Regularly audit overrides**
   - Run `pnpm audit` to check for vulnerabilities
   - Review if overrides are still needed when dependencies update

6. **Test after applying overrides**
   - Run your test suite to ensure nothing breaks
   - Check that builds still work correctly

## Example Workflow

```bash
# 1. Add override to package.json
# Edit package.json: add "vulnerable-package": ">=2.0.0" to pnpm.overrides

# 2. Clean install
pnpm run clean-install

# 3. Verify
pnpm run verify-overrides

# 4. Check specific package if needed
pnpm why vulnerable-package

# 5. Run tests
pnpm test

# 6. Commit changes
git add package.json pnpm-lock.yaml
git commit -m "chore: add override for vulnerable-package"
```

## CI/CD Considerations

In CI/CD pipelines, always do a fresh install:

```yaml
# Example GitHub Actions
- name: Install dependencies
  run: |
    rm -rf node_modules packages/*/node_modules pnpm-lock.yaml
    pnpm install --frozen-lockfile=false
```

Or use the clean-install script:

```yaml
- name: Install dependencies
  run: pnpm run clean-install
```

## Related Documentation

- [pnpm Overrides Documentation](https://pnpm.io/package_json#pnpmoverrides)
- [SECURITY.md](./SECURITY.md) - Security advisories and override examples
- [README.md](./README.md) - General project documentation

