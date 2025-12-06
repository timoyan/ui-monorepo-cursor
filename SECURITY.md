# Security Advisories

## CVE-2024-51757: happy-dom Server-Side Code Execution Vulnerability

### Summary

The `happy-dom` package (used as a transitive dependency via `@wyw-in-js/transform`) has a critical security vulnerability that allows server-side code execution through `<script>` tags.

### Vulnerability Details

- **CVE ID**: CVE-2024-51757
- **Severity**: Critical
- **Affected Versions**: All versions of `happy-dom` prior to 15.10.2
- **Fixed Version**: 15.10.2 and later

### Impact

This vulnerability enables attackers to execute arbitrary code on the server by injecting malicious scripts into the DOM. The root cause lies in `happy-dom`'s reliance on Node.js's `vm` module for script execution, which is not designed as a security mechanism and can be exploited to escape the sandbox.

### Current Status

✅ **RESOLVED** - All instances of `happy-dom` have been upgraded to safe versions.

The project uses `@wyw-in-js/transform@0.8.0`, which depends on:
- `happy-dom@20.0.10` ✅ (Safe - version 20.0.10 is well above the fixed version 15.10.2)

Previously, `@linaria/shaker@5.0.3` → `@linaria/core@5.0.2` was pulling in:
- `happy-dom@10.8.0` ❌ (Vulnerable - version 10.8.0 is below the fixed version 15.10.2)

**This has been fixed** via pnpm override - all instances now use `happy-dom@20.0.10`.

### Mitigation

✅ **pnpm override added** - The root `package.json` includes an override to force all `happy-dom` versions to `>=15.10.2`:

```json
{
  "pnpm": {
    "overrides": {
      "happy-dom": ">=15.10.2"
    }
  }
}
```

**To apply the override:**
```bash
pnpm install
```

This will ensure that even transitive dependencies like `@linaria/core@5.0.2` will use a safe version of `happy-dom`.

**Verify the fix:**
```bash
pnpm why happy-dom
```

All instances should show version >= 15.10.2.

### Best Practices

- Never execute untrusted JavaScript code outside of a web browser
- The `vm` module is not a security boundary
- Review any code that processes user-provided HTML/JavaScript

### References

- [CVE-2024-51757 Advisory](https://advisories.gitlab.com/pkg/npm/happy-dom/CVE-2024-51757/)
- [Endor Labs Analysis](https://www.endorlabs.com/learn/happier-doms-the-perils-of-running-untrusted-javascript-code-outside-of-a-web-browser)

### Last Updated

2024-12-19

