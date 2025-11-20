"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useEffectEvent,
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

  const prevStateRef = useRef<TState>(initialState);

  const handleStateChange = useEffectEvent((currentState: TState) => {
    if (currentState.success) {
      options.onSuccess?.(currentState);
      options.onSettled?.(currentState);
    } else {
      options.onError?.(currentState);
      options.onSettled?.(currentState);
    }
  });

  useEffect(() => {
    if (state === prevStateRef.current) return;

    handleStateChange(state);
    prevStateRef.current = state;
  }, [state]);

  const execute = (payload: TPayload) => {
    startTransition(() => {
      dispatch(payload);
    });
  };

  return { state, execute, pending };
}
