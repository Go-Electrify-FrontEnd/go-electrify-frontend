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
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (state === initialRef.current) {
      return;
    }
    const currentOptions = optionsRef.current;

    currentOptions.onSettled?.(state);

    if (state.success) {
      currentOptions.onSuccess?.(state);
      return;
    }

    currentOptions.onError?.(state);
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
