import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

export function renderHook<TResult>(
  hook: () => TResult,
): {
  result: { current: TResult };
} {
  const result = { current: undefined as unknown as TResult };

  function TestComponent() {
    result.current = hook();
    return null;
  }

  act(() => {
    TestRenderer.create(<TestComponent />);
  });

  return { result };
}

export { act };
