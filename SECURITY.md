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

✅ **pnpm override added** - The root `package.json` includes an override to force all `glob` versions to `>=10.5.0 <11.0.0`:

```json
{
  "pnpm": {
    "overrides": {
      "glob": ">=10.5.0 <11.0.0"
    }
  }
}
```

**Note on version constraint**: The upper bound `<11.0.0` is included to maintain compatibility with older dependencies (like `rimraf@2.x` and `rimraf@3.x`) that support Node 18. `glob@11.0.0` and later versions require Node 20+, which would break compatibility with these packages. The constraint `>=10.5.0 <11.0.0` ensures we get a secure version (10.5.0+) while maintaining Node 18 compatibility.

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

---

## GHSA-67mh-4wv8-2f99: esbuild Development Server CORS Vulnerability

### Summary

The `esbuild` package development server allows any websites to send any request to the development server and read the response due to default CORS settings. This enables attackers to steal source code from development servers.

### Vulnerability Details

- **Advisory ID**: GHSA-67mh-4wv8-2f99
- **Severity**: Moderate
- **CVSS Score**: 5.3 (CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:H/I:N/A:N)
- **Affected Versions**: `esbuild` <=0.24.2
- **Fixed Versions**: `esbuild@0.25.0` or higher
- **Component**: Development server only (production builds are not affected)

### Impact

This vulnerability allows attackers to:
- Send requests to the esbuild development server from any website
- Read responses from the development server, including:
  - Compiled JavaScript/CSS files
  - Source maps (if enabled)
  - Directory listings
  - File change notifications via SSE endpoint

**Attack Scenario:**
1. Attacker serves a malicious web page
2. User accesses the malicious page while running an esbuild dev server
3. Malicious page uses `fetch()` to request files from `http://127.0.0.1:8000/` (or other dev server port)
4. Due to `Access-Control-Allow-Origin: *` header, the request succeeds
5. Attacker can steal source code and compiled assets

### Current Status

✅ **RESOLVED** - All instances of `esbuild` have been upgraded to safe versions.

The project uses `esbuild` as a transitive dependency via:
- `vite` → `esbuild`
- `@storybook/addon-essentials` → `@storybook/core-common` → `esbuild`

Previously, vulnerable versions (<=0.24.2) could be pulled in, including:
- `esbuild@0.21.5` (via vite)
- `esbuild@0.18.20` (via @storybook/core-common)

**This has been fixed** via pnpm override - all instances now use `esbuild@0.27.1` (or higher).

### Mitigation

✅ **pnpm override added** - The root `package.json` includes an override to force all `esbuild` versions to `>=0.25.0`:

```json
{
  "pnpm": {
    "overrides": {
      "esbuild": ">=0.25.0"
    }
  }
}
```

**To apply the override:**
```bash
pnpm install
```

This will ensure that even transitive dependencies will use a safe version of `esbuild`.

**Verify the fix:**
```bash
pnpm why esbuild
```

All instances should show version >= 0.25.0.

### Important Notes

- **Development Server Only**: This vulnerability affects only the development server feature (`esbuild serve`)
- **Production Safe**: Production builds using `esbuild.build()` are **not affected**
- **Best Practice**: Never run development servers on untrusted networks or expose them publicly

### References

- [GitHub Advisory: GHSA-67mh-4wv8-2f99](https://github.com/advisories/GHSA-67mh-4wv8-2f99)
- [esbuild Security Fix Commit](https://github.com/evanw/esbuild/commit/de85afd65edec9ebc44a11e245fd9e9a2e99760d)

### Last Updated

2025-02-10

