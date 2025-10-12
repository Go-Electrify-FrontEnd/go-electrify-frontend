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

  useEffect(() => {
    if (state === initialRef.current) {
      return;
    }

    options.onSettled?.(state);

    if (state.success) {
      options.onSuccess?.(state);
    } else {
      options.onError?.(state);
    }
  }, [state, options.onError, options.onSettled, options.onSuccess]);

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
