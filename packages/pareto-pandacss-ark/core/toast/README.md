# Centralized Toast

Toast messages are controlled by a **single toaster instance** (`core/toast`). One `<AppToaster />` is rendered in `app/layout.tsx`, so all toasts show in one place (placement, duration, max count are configured in `createToaster.ts`).

**External usage must go through `useToast()` only.** Do not import `toast` or `toaster` from `@/core/toast` in app code; use the hook and then call `toast.*` or `registerAndToast` from its return value.

## Show / hide

- **Show**: Call `toast.*` from the object returned by `useToast()`, or use `registerAndToast()` for registry-backed toasts. Toasts auto-dismiss by duration (configurable per call).
- **Hide**: `toast.dismiss(id)` from `useToast()` return value, or close button in the toast UI.

## Usage

### 1. From components (event handlers)

Use `useToast()` and call `toast.*` in handlers.

```tsx
import { useToast } from "@/core/toast";

function SaveButton() {
  const { toast } = useToast();
  const handleSave = () => {
    saveData();
    toast.success({ title: "Saved", description: "Your changes have been saved." });
  };
  return <button onClick={handleSave}>Save</button>;
}
```

### 2. From components (useEffect / useLayoutEffect)

Use `useToast()` and defer the toast call with `queueMicrotask` to avoid React `flushSync` warnings:

```tsx
import { useToast } from "@/core/toast";

function MyComponent() {
  const { toast } = useToast();
  useEffect(() => {
    queueMicrotask(() => {
      toast.success({ title: "Loaded", description: "Data ready." });
    });
  }, []);
  return <div />;
}
```

### 3. From hooks

Use `useToast()` and call `toast.*` or `registerAndToast` from the return value.

```tsx
import { useToast } from "@/core/toast";

function useSubmit() {
  const { toast } = useToast();
  const submit = async () => {
    try {
      await api.post(...);
      toast.success({ title: "Done" });
    } catch {
      toast.error({ title: "Failed", description: "Please try again." });
    }
  };
  return { submit };
}
```

## API (from `useToast()`)

`useToast()` returns `{ toast, registerAndToast }`:

- **`toast.create(options)`** – Generic toast (optional `type`: `"info" | "warning" | "success" | "error"`).
- **`toast.success(options)`** – Success toast.
- **`toast.error(options)`** – Error toast.
- **`toast.info(options)`** – Info toast (via create with type).
- **`toast.warning(options)`** – Warning toast (via create with type).
- **`toast.dismiss(id)`** – Dismiss a toast by id.
- **`registerAndToast(content, options?)`** – Register content, show toast, and by default unregister when dismissed (see registry section).

Options typically include `title`, `description`, and optionally `duration` (ms; default from toaster config).

### Plain text

Toast renders `title` and `description` from options as **plain text only**. The toast layer does **not** parse HTML strings. For icons, custom styles, or HTML, use the **registry** or `registerAndToast` (see below).

### Custom content via registry (contentKey)

The registry is **global scope**: register entries (e.g. at module load) **before** showing toasts; the Toaster looks up by `meta.contentKey` when rendering.

1. **Register an entry** (e.g. at module load):

```tsx
import { registerToastContent } from "@/components/ui/toast";

registerToastContent("success-save", {
  title: "Saved",
  description: "Your changes have been saved.",
  icon: <CheckIcon />,
});
```

2. **Call toast with only a string in meta**:

```tsx
const { toast } = useToast();
toast.success({
  title: "Saved",
  meta: { contentKey: "success-save" },
});
```

### Dynamic content and cleanup

For **dynamic** content, use **`registerAndToast()`** so the entry is unregistered when the toast is dismissed.

### No React elements in toast options

Do **not** pass React elements in `title`, `description`, or `meta` (except the string `meta.contentKey`). Zag.js stores options in its state machine; React 19 can throw **`'run' called with illegal receiver`**. Use **plain strings** or the **contentKey registry** for custom UI.

For advanced use (e.g. custom ids, update), import **`toaster`** from `@/core/toast/createToaster`.
