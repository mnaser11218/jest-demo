## Jest Features Explained

This repo is structured to **teach Jest step-by-step** through real component tests.
All of the examples below come directly from the code in this repository (see the `__tests__` folder and the `Counter` component).

### `describe()`

Groups related tests together. You can nest `describe` blocks to organize features or states.

```ts
describe("Counter Component", () => {
  describe("Counter Increment Button", () => {
    // increment tests go here
  });
});
```

**Why:** Organization and readability. Nested describes mirror your component → feature → behavior hierarchy.
**In this repo:** We use `describe` to separate tests for the **increment button**, **decrement button**, and **incrementor input**.

---

### `it()` / `test()`

Defines a single test case. `it()` and `test()` are interchangeable; `it()` often reads more naturally.

```ts
it("renders description and default count", () => {
  expect(screen.getByText(/counter 1/i)).toBeInTheDocument();
});
```

**Why:** Each test documents one expected behavior, making failures clear.
**In this repo:** Each `it` checks exactly one outcome, such as rendering the default count or updating after a button click.

---

### `beforeEach()`

Runs setup code before each test in the current block (e.g., rendering the component).

```ts
beforeEach(() => {
  render(<Counter description="Counter 1" defaultCount={0} />);
});
```

**Why:** Eliminates duplication and ensures each test starts fresh.
**In this repo:** We render the `Counter` before each test so every test begins with a clean state.

---

### `expect()` + **Matchers**

`expect(value)` asserts on your UI or values. Common matchers used here:

* `toBeInTheDocument()` (from React Testing Library) — element exists in the DOM
* `toBe()` — strict equality (numbers, strings)
* `toEqual()` — deep equality (objects/arrays)

```ts
expect(screen.getByText("Current Count: 0")).toBeInTheDocument();
expect(2 + 2).toBe(4);
expect({ a: 1 }).toEqual({ a: 1 });
```

**Why:** Expressive, readable checks that verify behavior.
**In this repo:** We check things like `"Current Count: 1"` appears after clicking the increment button.

---

### Simulating Events (`fireEvent` & `user-event`)

* `fireEvent` triggers low-level events (`click`, `change`, etc.)
* `@testing-library/user-event` simulates **real user interactions** (typing, clearing, tabbing)

```ts
fireEvent.click(screen.getByRole("button", { name: "Add to Counter" }));
user.clear(screen.getByLabelText(/incrementor/i));
user.type(screen.getByLabelText(/incrementor/i), "5");
```

**Why:** Validates how your UI responds to real usage.
**In this repo:** We use `fireEvent` for clicks and `user-event` for typing into the incrementor input.

---

## Step-by-Step Testing Flow (Learn by Example)

Below is the **teaching flow we follow in this repo’s tests**:

1. **Render the component**

   ```ts
   render(<Counter description="Counter 1" defaultCount={0} />);
   ```

2. **Query the UI like a user would**

   ```ts
   const addButton = screen.getByRole("button", { name: "Add to Counter" });
   const input = screen.getByLabelText(/incrementor/i);
   ```

3. **Simulate interactions**

   ```ts
   user.type(input, "5");
   fireEvent.click(addButton);
   ```

4. **Assert on the result**

   ```ts
   expect(screen.getByText("Current Count: 5")).toBeInTheDocument();
   ```

👉 All of these steps are demonstrated in the repo’s actual test code. Open the test files to see how they are applied in practice.

---

## Full Example (From This Repo)

```tsx
import { Counter } from "./Counter";
import { fireEvent, render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

describe("Counter Component", () => {
  beforeEach(() => {
    render(<Counter description="Counter 1" defaultCount={0} />);
  });

  it("renders description and default count", () => {
    expect(screen.getByText(/counter 1/i)).toBeInTheDocument();
    expect(screen.getByText("Current Count: 0")).toBeInTheDocument();
  });

  describe("Counter Increment Button", () => {
    beforeEach(() => {
      fireEvent.click(screen.getByRole("button", { name: "Add to Counter" }));
    });
    it("increments the count", () => {
      expect(screen.getByText("Current Count: 1")).toBeInTheDocument();
    });
  });

  describe("Counter Decrement Button", () => {
    beforeEach(() => {
      fireEvent.click(screen.getByLabelText("Subtract from Counter"));
    });
    it("decrements the count", () => {
      expect(screen.getByText("Current Count: -1")).toBeInTheDocument();
    });
  });

  describe("Counter Incrementor Input By 5", () => {
    beforeEach(() => {
      user.clear(screen.getByLabelText(/incrementor/i));
      user.type(screen.getByLabelText(/incrementor/i), "5");
      user.click(screen.getByRole("button", { name: "Add to Counter" }));
    });
    it("increments by the input value", () => {
      expect(screen.getByText("Current Count: 5")).toBeInTheDocument();
    });
  });
});
```

👉 **This exact example lives in the repo**, so learners can run the tests themselves and experiment.

---

## Testing Commands

Run all tests:

```bash
npm test
# or
yarn test
```

Run tests with coverage:

```bash
npm test -- --coverage
# or
yarn test --coverage
```

---

## Tips for Learners

* Follow the **Arrange – Act – Assert** pattern (render → interact → expect).
* Prefer **accessible queries** (`getByRole`, `getByLabelText`) over test IDs.
* Keep tests **focused**: one expectation per `it`.
* Use `beforeEach` to reset state so tests never depend on each other.
