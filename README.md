# @zal-kit/react

A collection of useful React hooks for modern web applications.

## Requirements

This package requires the following peer dependencies:

- `react` >= 16.8.0
- `react-dom` >= 16.8.0

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
import { useToggle } from '@zal-kit/react';

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

## TypeScript

This package is written in TypeScript and includes type definitions.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Publishing

To publish a new version:

```bash
# Update version
npm version patch  # or minor, major

# Publish to npm
npm publish
```
