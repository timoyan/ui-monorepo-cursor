# Security Advisories

## CVE-2024-51757: happy-dom Server-Side Code Execution Vulnerability

### Summary

The `happy-dom` package (used as a transitive dependency via `@wyw-in-js/transform`) has a critical security vulnerability that allows server-side code execution through `<script>` tags.

### Vulnerability Details

- **CVE ID**: CVE-2024-51757
- **Severity**: Critical
- **Affected Versions**: All versions of `happy-dom` prior to 20.0.2
- **Fixed Version**: 20.0.2 and later (earliest fixed version)

### Impact

This vulnerability enables attackers to execute arbitrary code on the server by injecting malicious scripts into the DOM. The root cause lies in `happy-dom`'s reliance on Node.js's `vm` module for script execution, which is not designed as a security mechanism and can be exploited to escape the sandbox.

### Current Status

✅ **RESOLVED** - All instances of `happy-dom` have been upgraded to safe versions.

The project uses `@wyw-in-js/transform@0.8.0`, which depends on:
- `happy-dom@20.0.10` ✅ (Safe - version 20.0.10 is above the fixed version 20.0.2)

Previously, `@linaria/shaker@5.0.3` → `@linaria/core@5.0.2` was pulling in:
- `happy-dom@10.8.0` ❌ (Vulnerable - version 10.8.0 is below the fixed version 20.0.2)

**This has been fixed** via pnpm override - all instances now use `happy-dom@20.0.10`.

### Mitigation

✅ **pnpm override added** - The root `package.json` includes an override to force all `happy-dom` versions to `>=20.0.2`:

```json
{
  "pnpm": {
    "overrides": {
      "happy-dom": ">=20.0.2"
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

All instances should show version >= 20.0.2.

### Best Practices

- Never execute untrusted JavaScript code outside of a web browser
- The `vm` module is not a security boundary
- Review any code that processes user-provided HTML/JavaScript

### References

- [CVE-2024-51757 Advisory](https://advisories.gitlab.com/pkg/npm/happy-dom/CVE-2024-51757/)
- [Endor Labs Analysis](https://www.endorlabs.com/learn/happier-doms-the-perils-of-running-untrusted-javascript-code-outside-of-a-web-browser)

### Last Updated

2024-12-19

---

## GHSA-5j98-mcp5-4vw2: glob CLI Command Injection Vulnerability

### Summary

The `glob` package CLI contains a command injection vulnerability in its `-c/--cmd` option that allows arbitrary command execution when processing files with malicious names. When `glob -c <command> <patterns>` is used, matched filenames are passed to a shell with `shell: true`, enabling shell metacharacters in filenames to trigger command injection.

### Vulnerability Details

- **Advisory ID**: GHSA-5j98-mcp5-4vw2
- **CVE ID**: CVE-2025-64756
- **Severity**: High
- **Affected Versions**: `glob` v10.2.0 through v11.0.3
- **Fixed Versions**: `glob@10.5.0`, `glob@11.1.0`, or higher
- **Component**: CLI only (the core library API is not affected)

### Impact

This vulnerability allows attackers to execute arbitrary commands on the system when:
- The `glob` CLI is used with the `-c` or `--cmd` option
- Files with malicious names containing shell metacharacters (e.g., `$()`, backticks, `;`, `&`, `|`) are processed
- Commands execute with full privileges of the user running the glob CLI

**Attack Scenarios:**
- CI/CD pipelines using `glob -c` on untrusted content (e.g., PR branches)
- Developer workstations processing files from untrusted sources
- Automated systems processing uploaded files or external content

### Current Status

✅ **RESOLVED** - All instances of `glob` have been upgraded to safe versions.

The project uses `glob` as a transitive dependency via:
- `@storybook/addon-essentials` → `@storybook/core-common` → `glob`

Previously, vulnerable versions (v10.2.0 through v11.0.3) could be pulled in.

**This has been fixed** via pnpm override - all instances now use `glob@>=10.5.0`.

### Mitigation

✅ **pnpm override added** - The root `package.json` includes an override to force all `glob` versions to `>=10.5.0`:

```json
{
  "pnpm": {
    "overrides": {
      "glob": ">=10.5.0"
    }
  }
}
```

**To apply the override:**
```bash
pnpm install
```

This will ensure that even transitive dependencies will use a safe version of `glob`.

**Verify the fix:**
```bash
pnpm why glob
```

All instances should show version >= 10.5.0 (or >= 11.1.0 if using v11.x).

### Important Notes

- **CLI Only**: This vulnerability affects only the command-line interface (`glob -c` or `glob --cmd`)
- **Library Safe**: The core glob library API (`glob()`, `globSync()`, streams/iterators) is **not affected**
- **Alternative**: If you must use the CLI with positional arguments, consider using `--cmd-arg`/`-g` option instead

### References

- [GitHub Advisory: GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2)
- [CVE-2025-64756](https://nvd.nist.gov/vuln/detail/CVE-2025-64756)
- [glob Security Fix Commit](https://github.com/isaacs/node-glob/commit/47473c046b91c67269df7a66eab782a6c2716146)

### Last Updated

2025-12-07

