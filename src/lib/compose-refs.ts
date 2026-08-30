/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/compose-refs.tsx
 */

import * as React from "react";

// LegacyRef<T> (string | Ref<T>) is what `ComponentProps<"div">["ref"]` etc. actually carry
// in current @types/react, for JSX.IntrinsicElements' historical string-ref support. React
// itself never passes a string ref to a function component (string refs only ever worked on
// class components), so the string branch below is unreachable in practice — accepted here
// only so callers using an intrinsic element's `ref` prop type-check without an extra cast.
type PossibleRef<T> = React.LegacyRef<T> | undefined;

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    return ref(value);
  }

  if (typeof ref === "string") {
    return;
  }

  if (ref !== null && ref !== undefined) {
    // RefObject<T>.current is typed readonly (meant for React-managed DOM refs) — this
    // utility's whole purpose is to write into whatever ref shape it's handed, callback
    // or object, same escape hatch Radix's own upstream compose-refs uses.
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    // React <19 will log an error to the console if a callback ref returns a
    // value. We don't use ref cleanups internally so this will only happen if a
    // user's ref callback returns a value, which we only expect if they are
    // using the cleanup functionality added in React 19.
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  // biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-run this callback when the refs change
  return React.useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
