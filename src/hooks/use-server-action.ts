"use client";

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface ServerActionOptions<TState extends { success: boolean }> {
  onSuccess?: (state: TState) => void;
  onError?: (state: TState) => void;
  onSettled?: (state: TState) => void;
}

export function useServerAction<
  TState extends { success: boolean },
  TPayload = FormData,
>(
  action: (state: TState, payload: TPayload) => Promise<TState>,
  initialState: TState,
  options: ServerActionOptions<TState> = {},
) {
  const [state, dispatch, pending] = useActionState<TState, TPayload>(
    action,
    initialState as Awaited<TState>,
  );
  const initialRef = useRef(initialState);
  // Track the latest options without an effect to avoid an extra render
  // cycle when callers pass inline option objects.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Track previous state so we can avoid invoking callbacks repeatedly for
  // the same logical transition (reduces spurious calls and potential
  // infinite loops if callers update options in response to callbacks).
  const prevStateRef = useRef<TState | null>(initialRef.current);

  useEffect(() => {
    // Skip the initial state.
    if (state === initialRef.current) return;

    const currentOptions = optionsRef.current;

    // Always notify 'onSettled' when the state changes from the initial
    // value to anything else.
    currentOptions.onSettled?.(state);

    // Only invoke onSuccess/onError when the success flag actually
    // transitions. This avoids re-invoking handlers when the state
    // object identity changes but the logical outcome hasn't.
    const prev = prevStateRef.current;
    const prevSuccess = prev ? Boolean(prev.success) : undefined;
    const nextSuccess = Boolean(state.success);

    if (prevSuccess !== nextSuccess) {
      if (nextSuccess) currentOptions.onSuccess?.(state);
      else currentOptions.onError?.(state);
    }

    prevStateRef.current = state;
  }, [state]);

  const execute = useCallback(
    (payload: TPayload) => {
      startTransition(() => {
        dispatch(payload);
      });
    },
    [dispatch],
  );

  return { state, execute, pending };
}
