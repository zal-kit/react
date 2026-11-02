# @zal-kit/react

A collection of useful React hooks for modern web applications.

## Requirements

This package requires the following peer dependencies:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0
- `react-router-dom` >= 6.0.0 *(optional, only needed for `useNavigateWithParams`)*

## Installation

```bash
npm install @zal-kit/react
# or
yarn add @zal-kit/react
# or
pnpm add @zal-kit/react
```

## Hooks

### `useToggle`

A simple hook for managing boolean state with a toggle function.

```typescript
import { useToggle } from "@zal-kit/react";

function MyComponent() {
  const [isOpen, toggle, setIsOpen] = useToggle(false);

  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setIsOpen(true)}>Open</button>
      {isOpen && <div>Content</div>}
    </div>
  );
}
```

**API:**
- `initialValue` (boolean, optional): Initial state value (default: `false`)
- Returns: `[state, toggle, setState]`
  - `state`: Current boolean value
  - `toggle`: Function to toggle the state
  - `setState`: Function to set state directly

---

### `useOnlineStatus`

Tracks browser network connection status via `online` and `offline` window events.

```typescript
import { useOnlineStatus } from "@zal-kit/react";

function StatusIndicator() {
  const { isOnline, isOffline } = useOnlineStatus();

  return (
    <div>
      {isOnline ? "🟢 Online" : "🔴 Offline (changes will sync when reconnected)"}
    </div>
  );
}
```

**API:**
- Returns: `{ isOnline: boolean, isOffline: boolean }`

---

### `useCountdown`

A countdown timer hook with formatting, controls, and completion callbacks.

```typescript
import { useCountdown } from "@zal-kit/react";

function OtpVerification() {
  const { count, formattedTime, isRunning, start, stop, reset } = useCountdown({
    initialCount: 60,
    intervalMs: 1000,
    autoStart: true,
    onFinish: () => alert("Time expired!"),
  });

  return (
    <div>
      <p>Time remaining: {formattedTime} ({count}s)</p>
      <button onClick={start} disabled={isRunning}>Start</button>
      <button onClick={stop} disabled={!isRunning}>Stop</button>
      <button onClick={() => reset()}>Resend (Reset to 60s)</button>
    </div>
  );
}
```

**API:**
- Options:
  - `initialCount` (number, required): Starting count (e.g. seconds)
  - `intervalMs` (number, optional): Timer interval in milliseconds (default: `1000`)
  - `autoStart` (boolean, optional): Start automatically on mount (default: `true`)
  - `onFinish` (function, optional): Fired when the countdown reaches 0
- Returns:
  - `count`: Current numeric count
  - `formattedTime`: `MM:SS` formatted string
  - `isRunning`: Whether the timer is currently active
  - `start()`: Start or resume countdown
  - `stop()`: Pause countdown
  - `reset(newCount?)`: Reset timer (optionally specifying a new starting count)

---

### `useNavigateWithParams`

A wrapper around React Router's `useNavigate` that preserves existing URL query parameters when navigating across routes.

```typescript
import { useNavigateWithParams } from "@zal-kit/react";

function StepNavigation() {
  const { push, replace, searchParams } = useNavigateWithParams();

  const handleNext = () => {
    // Current URL: /login?clientId=posme&redirectUri=%2Fcallback
    // Result URL:  /verify?clientId=posme&redirectUri=%2Fcallback&step=2
    push("/verify", { step: 2 });
  };

  const handleClear = () => {
    // Clear all existing parameters and set only fresh ones
    push("/dashboard", { token: "abc" }, { clearExisting: true });
  };

  return <button onClick={handleNext}>Next Step</button>;
}
```

**API:**
- Methods:
  - `push(pathname, newParams?, options?)`
  - `replace(pathname, newParams?, options?)`
  - `searchParams`: Current `URLSearchParams` instance
  - `pushWithParam` / `replaceWithParam`: Aliases for backward compatibility
- Parameters:
  - `pathname`: Target route string
  - `newParams` (optional): Key-value map (`string`, `number`, `boolean`, or `null`/`undefined`/`""` to delete keys)
  - `options.clearExisting` (optional, boolean): If `true`, drops existing query params

## TypeScript

This package is written in TypeScript and includes type definitions and source maps.

## License

MIT
