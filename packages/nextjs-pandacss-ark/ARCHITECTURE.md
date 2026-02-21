# Project Architecture

This document describes the folder structure and organization principles of the `nextjs-pandacss-ark` project.

## Directory Structure

```
nextjs-pandacss-ark/
├── core/                    # App-level concerns
│   ├── store/              # Redux store configuration
│   ├── router/             # URL routing logic, step management
│   └── error-boundary/     # Error handling
│
├── pages/                  # Next.js pages (Pages Router)
│   ├── _app.tsx           # App entry, combines core providers
│   ├── index.tsx          # Home page
│   └── checkout.tsx       # Checkout page (combines modules/features)
│
├── modules/                # Aggregate features (Combine multi features)
│   └── shipping-address/   # Shipping address module example
│       ├── index.tsx      # Module entry
│       └── features/      # Features aggregated by this module
│           ├── saved-addresses-list/
│           ├── address-form/      # Add/edit address form
│           └── pickup-map/
│
├── features/              # Independent features (can be used by multiple modules)
│   ├── cart/              # Cart feature
│   │   ├── ConnectedCartSample.tsx
│   │   ├── __tests__/     # Test files (same directory as feature)
│   │   └── index.ts
│   └── ...                # Other reusable features
│
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Accordion)
│   │   ├── button/
│   │   │   ├── index.tsx
│   │   │   └── __tests__/
│   │   └── accordion/
│   └── layout/            # Layout components (Header, Footer)
│
├── apis/                  # RTK Query API slices
│   ├── apiSlice.ts       # Base API slice
│   └── cart.ts           # Cart API endpoints
│
├── hooks/                 # Shared hooks
│   └── useMSWReady.ts
│
└── mocks/                 # MSW configuration (for development and testing)
    ├── handlers.ts
    ├── browser.ts
    └── server.ts
```

## Layer Responsibilities

### Core (App-level)

**Purpose**: Handle app-level concerns

**Responsibilities**:
- **Step navigation**: Manage multi-step flows (e.g., checkout flow)
  - URL handling (route parameters, query strings)
  - Read state from Redux store
- **Error handling**: Global error boundaries and error dispatching
- **Store configuration**: Redux store setup and type definitions

**State Management**:
- Use Redux to manage state across modules/features
- Manage app-level state (e.g., current step, global errors)

**Example**:
```typescript
// core/router/useStepNavigation.ts
// Manage step navigation logic, read Redux state, update URL
```

### Pages (Page-level)

**Purpose**: Next.js pages that combine domains/features/components

**Responsibilities**:
- Combine modules, features, components
- Report page-scoped state to Redux store
- Handle page-level routing logic

**State Management**:
- Read Redux store
- Dispatch Redux actions
- Should not contain complex business logic (delegate to Modules/Features)

**Example**:
```typescript
// pages/checkout.tsx
import { ShippingAddressModule } from '@/modules/shipping-address';

export default function CheckoutPage() {
  return <ShippingAddressModule />;
}
```

### Modules (Aggregate Features)

**Purpose**: Aggregate multiple related features to form a complete module

**Responsibilities**:
- Aggregate multiple features
- Coordinate interactions between features
- Report module-scoped state
  - To Redux store (state shared across features)
  - To parent component via callback (local state)

**State Management Decisions**:
- **Redux**: When state needs to be shared across features or used by core
- **Callback props**: When state is only used within the module or needs to be passed to parent

**Example**:
```typescript
// modules/shipping-address/index.tsx
import { SavedAddressesListFeature } from './features/saved-addresses-list';
import { AddressFormFeature } from './features/address-form';
import { PickupMapFeature } from './features/pickup-map';

export function ShippingAddressModule() {
  // Use Redux to manage state shared across features (e.g., selected address)
  const selectedAddress = useSelector(selectSelectedAddress);
  
  // Use callback to handle local state (e.g., form show/hide)
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      <SavedAddressesListFeature 
        onSelect={(address) => dispatch(setSelectedAddress(address))}
        onAddNew={() => setShowForm(true)}
      />
      {showForm && (
        <AddressFormFeature 
          onSave={(address) => {
            dispatch(addAddress(address));
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      <PickupMapFeature />
    </>
  );
}
```

### Features (Feature-level)

**Purpose**: Independent business features that can be used by multiple modules, or as sub-features within a module

**Responsibilities**:
- Implement a single business feature
- Combine components
- Report feature-scoped state
  - To Redux store (state shared across modules/features)
  - To parent component via callback (local state)

**State Management Decisions**:
- **Redux**: When state needs to be shared across modules/features or used by core
  - Example: Cart data (cart feature) needs to be used by multiple pages
- **Callback props**: When state is only used within the feature or needs to be passed to parent
  - Example: Form validation state, UI expand/collapse state

**Two Ways to Use Features**:

1. **Independent Features** (in `features/` directory): Can be used by multiple modules
   ```typescript
   // features/cart/ConnectedCartSample.tsx
   // Use Redux (RTK Query) to manage cart data (shared across pages)
   const { data: items } = useGetCartQuery();
   
   // Use local state to manage UI state
   const [inputQty, setInputQty] = useState(item.quantity);
   ```

2. **Module-specific Features** (in `modules/{module-name}/features/` directory): Only used within that module
   ```typescript
   // modules/shipping-address/features/saved-addresses-list/index.tsx
   export function SavedAddressesListFeature({ 
     onSelect, 
     onAddNew 
   }: {
     onSelect: (address: Address) => void;
     onAddNew: () => void;
   }) {
     const addresses = useSelector(selectSavedAddresses);
     
     return (
       <ul>
         {addresses.map(address => (
           <li key={address.id} onClick={() => onSelect(address)}>
             {address.name}
           </li>
         ))}
         <button onClick={onAddNew}>Add Address</button>
       </ul>
     );
   }
   ```

### Components (Component-level)

**Purpose**: Define reusable UI components

**Responsibilities**:
- Implement reusable UI components
- Report component-scoped state to parent component via callback

**State Management**:
- **Local state (useState)**: Internal component state
- **Callback props**: Communicate with parent

**Example**:
```typescript
// components/ui/button/index.tsx
export function Button({ onClick, children, ...props }) {
  // Use callback to communicate with parent
  return <button onClick={onClick} {...props}>{children}</button>;
}
```

## State Management Decision Tree

```
Does state need to be used across modules/features or core?
├─ Yes → Redux Store
│   └─ Examples: Cart data, user info, current step
│
└─ No → Does it need to be shared across multiple components?
    ├─ Yes → Callback props or Context
    │   └─ Examples: Form validation state, module internal coordination
    │
    └─ No → Local state (useState)
        └─ Examples: Input value, expand/collapse state
```

## Test Organization

**Principle**: Test files are placed in the same directory as the feature

**Unit test rules** (enforced by `pnpm run lint:test`):

- **No snapshot tests**: Do not use `toMatchSnapshot` or `toMatchInlineSnapshot`. Use explicit assertions (e.g. `expect(...).toBe()`, `expect(...).toContain()`, DOM/state queries) so tests are stable and intent is clear.

**Structure**:
```
features/
  └── cart/
      ├── ConnectedCartSample.tsx
      ├── __tests__/
      │   └── ConnectedCartSample.test.tsx
      └── index.ts

components/
  └── ui/
      └── button/
          ├── index.tsx
          └── __tests__/
              └── button.test.tsx
```

## Naming Conventions

- **Modules**: Use descriptive names that represent aggregated functionality (e.g., `shipping-address`)
- **Features**:
  - Independent features: Use feature names (e.g., `cart`, `payment`)
  - Module-specific features: Use specific feature names (e.g., `saved-addresses-list`, `address-form`, `pickup-map`)
- **Components**: Use UI component names (e.g., `button`, `accordion`, `header`)
- **Test files**: `*.test.tsx` or `*.test.ts`

## Modules vs Features Decision Guide

**When to create a Module?**
- When you need to aggregate multiple related features
- Example: `shipping-address` module aggregates three features: `saved-addresses-list`, `address-form`, `pickup-map`

**When to create an independent Feature (in `features/` directory)?**
- When the feature may be used by multiple modules
- Example: `cart` feature may be used by checkout page, product page, and other places

**When to create a Module-specific Feature (in `modules/{module-name}/features/` directory)?**
- When the feature is only used within a specific module, and that module needs to combine multiple related features
- Example: `saved-addresses-list` is only used within the `shipping-address` module

## Import Paths

Use `@/` as an alias for the project root directory:

```typescript
import { Button } from '@/components';
import { ConnectedCartSample } from '@/features/cart';
import { ShippingAddressModule } from '@/modules/shipping-address';
import { store } from '@/core/store';
import { useGetCartQuery } from '@/apis/cart';
```

## Migration Plan

Current project structure:
- `store/` → Will be moved to `core/store/` in the future
- `features/cart/` → Keep as is
- `components/` → Keep as is

**Note**: When migrating `store/` to `core/store/`, all import paths need to be updated.
