# Package Version & Update Management Policy

This document describes dependency version conventions, lockfile update practices, and recommended update cadence for this monorepo.

---

## 1. package.json version spec: use `^` or not

### Recommendation: **use `^` (caret)**

- **Semantics**: `^1.2.3` allows `>=1.2.3 <2.0.0` (no change to the left-most non-zero digit).
- **Benefits**: Get compatible minor/patch updates (bug fixes, security) without manually bumping versions.
- **Reproducibility**: Guaranteed by the **lockfile** (`pnpm-lock.yaml`); builds use the lockfile.

### Exceptions

- If team policy requires exact versions only, omit `^`.
- If a package has had breaking patch releases, pin to an exact version and document the reason in a comment or PR.

---

## 2. Lockfile updates (pnpm)

This project uses **pnpm**; the lockfile is `pnpm-lock.yaml`.

### Common commands

| Scenario | Command | Description |
|----------|---------|-------------|
| Install / sync | `pnpm install` | Install from package.json and existing lockfile; updates lockfile when needed. |
| Upgrade within range | `pnpm update` | Upgrade to latest within semver ranges and update lockfile. |
| Direct deps only | `pnpm update --depth 0` | Upgrade only direct dependencies of each package. |
| Interactive upgrade | `pnpm up -i` or `pnpm update -i` | List upgradable packages and choose versions interactively. |
| Specific packages | `pnpm update <pkg1> <pkg2>` | Upgrade only the listed packages within their ranges. |
| Upgrade to latest | `pnpm add <pkg>@latest` | Set package to latest and update lockfile (major may be breaking). |
| Check outdated | `pnpm outdated` | Show upgradable list only; does not write to lockfile. |

### CI / build

- Use **lockfile-consistent install** in CI, e.g.:
  - `pnpm install --frozen-lockfile` or
  - `pnpm ci` (if configured)
- Avoid install commands that mutate the lockfile in CI to keep builds reproducible.

---

## 3. Update strategy and cadence

| When | Recommended action |
|------|--------------------|
| **Add / remove dependency** | Run `pnpm install`, then commit updated `package.json` and `pnpm-lock.yaml`. |
| **Weekly / bi-weekly** | Run `pnpm outdated`, then `pnpm up -i` to upgrade chosen packages; run tests and commit. |
| **Monthly / quarterly** | Broader upgrade (e.g. React, Next, build tools) with `pnpm up -i` or `pnpm update`; run full test and E2E, then commit. |
| **Security advisory** | Run `pnpm audit`, apply recommended fixes; or `pnpm add <pkg>@<patch-version>` for a single package, then commit lockfile. |

### Short workflow

1. **Add dependency**: `pnpm add <pkg>` → updates lockfile → commit both `package.json` and `pnpm-lock.yaml`.
2. **Regular upgrade**: `pnpm outdated` → `pnpm up -i` → tests pass → commit.
3. **CI**: Always use `pnpm install --frozen-lockfile` (or equivalent); do not change the lockfile in CI.

---

## 4. Node.js version constraint per package (engines)

To require a specific Node version for a package (e.g. Node 22 only), add to that package’s `package.json`:

```json
"engines": {
  "node": ">=22.0.0 <23.0.0"
}
```

- This allows **Node.js 22.x** only.
- pnpm only warns by default when the Node version does not match. To **fail** install on wrong Node, set in repo root `.npmrc`:
  ```ini
  engine-strict=true
  ```

---

## 5. Related docs

- [PNPM_OVERRIDES_GUIDE.md](./PNPM_OVERRIDES_GUIDE.md) — pnpm overrides usage
- [VERSION_DOCUMENTATION.md](./VERSION_DOCUMENTATION.md) — React and other version requirements and documentation
