---
name: tdd-workflow
description: Test-Driven Development workflow - write failing tests first, then implement to pass. Use when user says "tdd", "test first", "red green refactor", or wants test-driven approach.
---

# TDD Workflow

Execute Test-Driven Development with the Red-Green-Refactor cycle.

## When to Use

- User wants test-first development
- User says "tdd", "test first", "red green refactor"
- Implementing new functionality that needs tests
- Fixing bugs with regression tests
- User explicitly requests TDD methodology

## TDD Cycle

```
┌─────────────────────────────────────┐
│            TDD CYCLE                │
│                                     │
│    ┌─────┐                          │
│    │ RED │ Write failing test       │
│    └──┬──┘                          │
│       │                             │
│       ▼                             │
│   ┌───────┐                         │
│   │ GREEN │ Write minimal code      │
│   └───┬───┘ to pass                 │
│       │                             │
│       ▼                             │
│  ┌──────────┐                       │
│  │ REFACTOR │ Improve code          │
│  └────┬─────┘ (tests stay green)    │
│       │                             │
│       └──────► Repeat               │
│                                     │
└─────────────────────────────────────┘
```

## Workflow

### Phase 1: RED - Write Failing Test

**Step 1.1: Understand the Requirement**

Before writing any test:
- What behavior needs to be implemented?
- What are the inputs and expected outputs?
- What edge cases exist?

**Step 1.2: Write the Test**

Create a test that describes the desired behavior:

```javascript
// Example: JavaScript/Jest
describe('calculateTotal', () => {
  it('should sum all items in cart', () => {
    const cart = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 1 }
    ];
    expect(calculateTotal(cart)).toBe(25);
  });
});
```

```python
# Example: Python/pytest
def test_calculate_total_sums_cart_items():
    cart = [
        {"price": 10, "quantity": 2},
        {"price": 5, "quantity": 1}
    ]
    assert calculate_total(cart) == 25
```

**Step 1.3: Verify Test Fails**

Run the test to confirm it fails:
```bash
# JavaScript
npm test -- --testNamePattern="calculateTotal"

# Python
pytest -k "test_calculate_total" -v

# Rust
cargo test calculate_total

# .NET
dotnet test --filter "CalculateTotal"
```

Expected output:
```
🔴 RED: Test fails as expected

Test: [test name]
Status: FAILED
Reason: [function not found / wrong result / etc]

This is correct - we haven't implemented yet.
Proceeding to GREEN phase...
```

### Phase 2: GREEN - Make Test Pass

**Step 2.1: Write Minimal Implementation**

Write the simplest code that makes the test pass:

```javascript
// Minimal implementation
function calculateTotal(cart) {
  return cart.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0);
}
```

**Key principles:**
- Write ONLY enough code to pass the test
- Don't add features not required by the test
- Don't optimize yet
- Don't handle edge cases not tested

**Step 2.2: Run Test Again**

```bash
npm test -- --testNamePattern="calculateTotal"
```

Expected output:
```
🟢 GREEN: Test passes!

Test: [test name]
Status: PASSED

Implementation complete for this test.
```

**Step 2.3: Verify No Regressions**

Run full test suite:
```bash
npm test
```

```
All tests: [X] passing, [0] failing

No regressions introduced.
```

### Phase 3: REFACTOR - Improve Code

**Step 3.1: Identify Improvements**

Look for:
- Code duplication
- Poor naming
- Complex logic that can be simplified
- Performance issues
- Missing error handling (if tests cover it)

**Step 3.2: Refactor Safely**

Make improvements while keeping tests green:

```javascript
// Before refactoring
function calculateTotal(cart) {
  return cart.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0);
}

// After refactoring (cleaner)
function calculateTotal(cart) {
  const itemTotal = (item) => item.price * item.quantity;
  return cart.reduce((sum, item) => sum + itemTotal(item), 0);
}
```

**Step 3.3: Run Tests After Each Change**

```bash
npm test
```

```
🔄 REFACTOR: Tests still pass

Changes made:
- Extracted itemTotal helper function
- Improved readability

All tests: [X] passing
```

### Phase 4: Repeat

**Add More Tests for Edge Cases:**

```javascript
it('should return 0 for empty cart', () => {
  expect(calculateTotal([])).toBe(0);
});

it('should handle single item', () => {
  expect(calculateTotal([{ price: 10, quantity: 1 }])).toBe(10);
});

it('should handle zero quantity', () => {
  expect(calculateTotal([{ price: 10, quantity: 0 }])).toBe(0);
});
```

**Cycle continues:**
1. 🔴 Write failing test for edge case
2. 🟢 Update implementation to handle it
3. 🔄 Refactor if needed
4. Repeat until feature complete

## Output Format

### Starting TDD
```
🧪 TDD WORKFLOW STARTED

Feature: [description]
Test file: [path]

Phase: RED
Writing failing test for: [specific behavior]
```

### After Each Phase
```
─────────────────────────────────────
🔴 RED PHASE COMPLETE

Test written: [test name]
Expected: [what test expects]
Actual: [test failure message]

Moving to GREEN phase...
─────────────────────────────────────
```

```
─────────────────────────────────────
🟢 GREEN PHASE COMPLETE

Test: [test name] ✓ PASSING
Implementation: [brief description]

Check for refactoring opportunities...
─────────────────────────────────────
```

```
─────────────────────────────────────
🔄 REFACTOR PHASE COMPLETE

Changes:
- [refactoring 1]
- [refactoring 2]

All tests: ✓ Still passing

Ready for next test cycle.
─────────────────────────────────────
```

### TDD Summary
```
✅ TDD CYCLE COMPLETE

Feature: [description]

Tests written: [count]
  ✓ [test 1]
  ✓ [test 2]
  ✓ [test 3]

Implementation:
  - [file]: [changes]

Code coverage: [if available]

All tests passing. Feature complete!
```

## Best Practices

**DO:**
- ✅ Write ONE test at a time
- ✅ Run tests after every change
- ✅ Keep implementations minimal
- ✅ Refactor only when tests pass
- ✅ Test behavior, not implementation

**DON'T:**
- ❌ Write implementation before test
- ❌ Write multiple tests before implementing
- ❌ Skip the refactor phase
- ❌ Refactor with failing tests
- ❌ Test private methods directly

## Test Frameworks by Language

| Language | Framework | Run Command |
|----------|-----------|-------------|
| JavaScript | Jest | `npm test` |
| TypeScript | Jest/Vitest | `npm test` |
| Python | pytest | `pytest` |
| Rust | cargo test | `cargo test` |
| Go | testing | `go test ./...` |
| Java | JUnit | `mvn test` |
| C# | xUnit/NUnit | `dotnet test` |
| Ruby | RSpec | `rspec` |

## Notes

- TDD is about design as much as testing
- Tests document expected behavior
- Small cycles = faster feedback
- Commit after each green phase
- Red phase should be quick (just write test)
- Green phase should be minimal (just pass)
- Refactor phase is where quality happens
