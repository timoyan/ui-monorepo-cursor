# Client-side persisted state (Zustand)

This package uses [Zustand](https://github.com/pmndrs/zustand) with the built-in **`persist`** middleware so selected state survives reloads via `localStorage` (or another storage you pass to `createJSONStorage`).

## Files

- [`persistedDemoStore.ts`](./persistedDemoStore.ts) — example store; copy the pattern for real features.
- [`../components/demo/PersistedStateDemo.tsx`](../components/demo/PersistedStateDemo.tsx) — UI demo on the home page.

## PII-safe defaults

- Only allowlisted non-sensitive fields are persisted via `partialize`.
- Sensitive drafts (example: `sensitiveNoteDraft`) stay in memory and are never written to `localStorage`.
- Persisted entries expire with TTL (`PERSIST_TTL_MS`) and are cleared on stale rehydrate.
- `clearPersistedDemoStoreOnLogout()` resets in-memory state and removes persisted storage on logout.

## SSR / hydration

If the app renders on the server, the first paint uses in-memory defaults. Persisted values appear after `localStorage` is read on the client.

1. Set `skipHydration: true` on the `persist(...)` options.
2. After mount (e.g. in `useEffect` in a client component, or one app-level client shell), call `useYourStore.persist.rehydrate()` once.

Without this, you can get React hydration warnings when the server HTML does not match the client’s restored state.

## Multi-tab sync

`localStorage` is shared by tabs, but each tab still has its own in-memory Zustand store.

- Call `subscribePersistedDemoStoreStorageSync()` in a client `useEffect`.
- When another tab writes to the same key, this tab receives a `storage` event and runs `rehydrate()` to pull the latest persisted values.
- For tabs restored from freeze/sleep, fallback listeners (`visibilitychange`, `pageshow`, `focus`) trigger an extra `rehydrate()` when the tab becomes active again.
- Rapid event bursts are coalesced so only one `rehydrate()` runs per event-loop round.
- Always call the returned unsubscribe function on unmount.

## Alternatives

- **Session-only**: use `sessionStorage` via `createJSONStorage(() => sessionStorage)`.
- **Heavier stacks**: Redux + `redux-persist` if you already standardize on Redux elsewhere in the monorepo.
