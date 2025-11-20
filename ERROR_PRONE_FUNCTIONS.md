# Error-Prone Functions & Recommendations

This document identifies error-prone patterns and functions discovered during the code analysis, along with recommendations for improvement.

## 1. Error-Prone Patterns

### 1.1 useServerAction Hook ✅ FIXED

**File:** `src/hooks/use-server-action.ts`

**Issue:**
```typescript
// Before - Error-prone pattern
options.onSuccess?.(currentState) || options.onSettled?.(currentState);
```

**Problem:**
- Uses `||` operator for side effects
- Second callback never executes if first one is defined
- Confusing and doesn't match expected behavior

**Fix Applied:**
```typescript
// After - Correct pattern
if (currentState.success) {
  options.onSuccess?.(currentState);
  options.onSettled?.(currentState);
} else {
  options.onError?.(currentState);
  options.onSettled?.(currentState);
}
```

**Status:** ✅ Fixed - Both callbacks now execute properly

---

### 1.2 Missing useEffect Dependencies ⚠️ NEEDS REVIEW

**Affected Files:**
- `src/features/stations/components/station-edit-dialog.tsx`
- `src/features/stations/components/charger-edit-dialog.tsx`
- `src/features/vehicle-models/components/vehicle-model-edit-dialog.tsx`
- Many others (67 warnings total)

**Issue Pattern:**
```typescript
useEffect(() => {
  form.reset(defaultValues);
}, []); // Missing: form, defaultValues
```

**Why This Is Error-Prone:**
- Stale closure - may use outdated values
- Effect won't re-run when dependencies change
- Can cause subtle bugs with form state

**Recommendations:**

1. **Add Missing Dependencies:**
```typescript
useEffect(() => {
  form.reset(defaultValues);
}, [form, defaultValues]); // Include all dependencies
```

2. **Or Use useEffectEvent (if intentional):**
```typescript
const resetForm = useEffectEvent(() => {
  form.reset(defaultValues);
});

useEffect(() => {
  resetForm();
}, []); // Only run on mount
```

3. **Or Add ESLint Disable Comment (if truly intentional):**
```typescript
useEffect(() => {
  form.reset(defaultValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // Intentionally only on mount
```

**Priority:** Medium - Should be reviewed case by case

---

### 1.3 Inconsistent Error Handling ⚠️ NEEDS IMPROVEMENT

**Issue:** 124 instances of `console.error` with inconsistent patterns

**Examples:**
```typescript
// Pattern 1: Just message
console.error("Failed to fetch data");

// Pattern 2: Message + status
console.error("Failed to fetch data, status:", response.status);

// Pattern 3: Message + error object
console.error("Error fetching data:", error);

// Pattern 4: Different format
console.error("getStationById: missing auth token");
```

**Problems:**
- No structured logging
- Errors not tracked in production
- Inconsistent formats make debugging harder
- No error categorization

**Recommended Solution:**

Create centralized error logger:

```typescript
// src/lib/error-logger.ts
type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

export const logger = {
  error(message: string, error?: unknown, context?: ErrorContext) {
    const timestamp = new Date().toISOString();
    const errorData = {
      timestamp,
      severity: 'error' as ErrorSeverity,
      message,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
    };
    
    // Console for development
    console.error(`[${timestamp}]`, message, error, context);
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error, { extra: errorData });
      // Or LogRocket, Datadog, etc.
    }
    
    return errorData;
  },

  warn(message: string, context?: ErrorContext) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}]`, message, context);
    // Optional: send to monitoring
  },

  info(message: string, context?: ErrorContext) {
    const timestamp = new Date().toISOString();
    console.info(`[${timestamp}]`, message, context);
  }
};
```

**Usage:**
```typescript
// Before
console.error("Failed to fetch stations, status:", response.status);

// After
logger.error(
  "Failed to fetch stations",
  new Error(`HTTP ${response.status}`),
  { component: 'StationsAPI', action: 'fetch', status: response.status }
);
```

**Priority:** Medium - Improves debugging and monitoring

---

### 1.4 Unsafe Type Assertions ⚠️ IDENTIFIED

**Pattern Found:**
```typescript
const searchValue = (searchColumn?.getFilterValue() as string) ?? "";
```

**Risk:**
- Type assertion bypasses TypeScript safety
- If value is not actually a string, runtime errors possible
- Common in table search implementations

**Safer Alternative:**
```typescript
const filterValue = searchColumn?.getFilterValue();
const searchValue = typeof filterValue === 'string' ? filterValue : '';
```

**Status:** Low priority - Works in practice, but could be improved

---

### 1.5 Missing Token Validation ⚠️ SECURITY CONCERN

**Pattern in API Functions:**
```typescript
export async function getStationById(id: string, token: string) {
  if (!token) {
    console.error("getStationById: missing auth token");
    return null; // Silent failure
  }
  // ... proceed with request
}
```

**Issues:**
- Silent failures don't alert user
- No validation of token format/expiry
- Inconsistent error handling

**Recommended Pattern:**
```typescript
export async function getStationById(id: string, token: string) {
  if (!token) {
    throw new Error("Authentication required");
  }
  
  // Optional: validate token format
  if (!isValidTokenFormat(token)) {
    throw new Error("Invalid authentication token");
  }
  
  try {
    // ... API call
  } catch (error) {
    logger.error("Failed to fetch station", error, {
      action: 'getStationById',
      stationId: id
    });
    throw error; // Let caller handle
  }
}
```

**Priority:** Medium - Security and UX concern

---

### 1.6 React Compiler Warnings ℹ️ KNOWN LIMITATION

**Issue:** TanStack Table useReactTable warnings

**Message:**
```
Compilation Skipped: Use of incompatible library
TanStack Table's `useReactTable()` API returns functions that cannot be memoized safely
```

**Explanation:**
- This is a known limitation of TanStack Table
- The library returns new function references on each render
- React Compiler skips optimization for these components

**Impact:**
- Components won't be automatically memoized
- May cause re-renders in child components
- Usually not a problem in practice

**Options:**
1. Accept the limitation (recommended)
2. Manually memoize specific parts if needed
3. Consider alternative table library (significant effort)

**Status:** ℹ️ Accepted - Monitor for actual performance issues

---

## 2. Recommendations by Priority

### High Priority (Should Fix Soon)

1. **Standardize Error Handling**
   - Implement centralized logger
   - Migrate from console.error
   - Add production error tracking
   - Estimated effort: 2-3 days

2. **API Security Improvements**
   - Better token validation
   - Throw errors instead of silent failures
   - Consistent error responses
   - Estimated effort: 1 day

### Medium Priority (Plan for Next Sprint)

3. **Review useEffect Dependencies**
   - Go through 67 warnings individually
   - Fix or document as intentional
   - Add comments explaining why
   - Estimated effort: 3-4 days

4. **Type Safety Improvements**
   - Replace type assertions with type guards
   - Add runtime validation where needed
   - Estimated effort: 1-2 days

### Low Priority (Technical Debt)

5. **React Compiler Warnings**
   - Monitor for performance issues
   - Consider optimization if needed
   - Estimated effort: N/A (accept for now)

---

## 3. Preventive Measures

### ESLint Configuration

Add stricter rules to prevent common mistakes:

```javascript
// eslint.config.mjs
export default {
  rules: {
    // Enforce useEffect dependencies
    'react-hooks/exhaustive-deps': 'error',
    
    // Prevent type assertions
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      { assertionStyle: 'never' }
    ],
    
    // Prevent console in production
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  }
};
```

### Code Review Checklist

When reviewing code, check for:
- [ ] useEffect has correct dependencies
- [ ] Errors are properly handled and logged
- [ ] No silent failures in API calls
- [ ] Type assertions are justified
- [ ] Auth tokens are validated

---

## 4. Migration Plan

### Phase 1: Error Handling (Week 1)
1. Create error logger utility
2. Migrate high-traffic API functions
3. Add production error tracking
4. Update documentation

### Phase 2: Security (Week 2)
1. Add token validation
2. Review API error handling
3. Add integration tests
4. Security audit

### Phase 3: Dependencies (Week 3-4)
1. Review useEffect warnings
2. Fix or document each case
3. Update ESLint config
4. Team training on patterns

---

## Summary

This analysis identified several error-prone patterns in the codebase:

- ✅ **Fixed:** 1 critical issue (useServerAction)
- ⚠️ **High Priority:** 2 issues (error handling, API security)
- ⚠️ **Medium Priority:** 2 issues (useEffect deps, type safety)
- ℹ️ **Low Priority:** 1 known limitation (React Compiler)

Following these recommendations will improve:
- Code reliability and maintainability
- Security and error handling
- Developer experience and debugging
- Production monitoring and alerting

Most importantly, establishing patterns and tooling will prevent these issues from recurring in new code.
