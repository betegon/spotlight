import { type DOMAttributes, type MouseEvent, type RefObject, useCallback, useRef } from "react";
type CallbackArgs = { height: number; left: number; top: number; width: number };

type Opts<T extends Element> = {
  elem: RefObject<T>;
  onPositionChange: (args: undefined | CallbackArgs) => void;
} & DOMAttributes<T>;

class AbortError extends Error {}
function getBoundingRect(elem: Element, { signal }: { signal: AbortSignal }): Promise<DOMRectReadOnly> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new AbortError());
    }

    const abortHandler = () => {
      reject(new AbortError());
    };

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const bounds = entry.boundingClientRect;
        resolve(bounds);
        signal.removeEventListener("abort", abortHandler);
      }
      observer.disconnect();
    });
    signal.addEventListener("abort", abortHandler);
    observer.observe(elem);
  });
}
function useMouseTracking<T extends Element>({
  elem,
  onPositionChange,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  ...rest
}: Opts<T>) {
  const controller = useRef<AbortController>(new AbortController());

  const handlePositionChange = useCallback(
    async (e: MouseEvent<T>) => {
      if (!elem.current) {
        onPositionChange(undefined);
        return;
      }

      try {
        const rect = await getBoundingRect(elem.current, {
          signal: controller.current.signal,
        });
        onPositionChange({
          height: rect.height,
          left: Math.min(e.clientX - rect.left, rect.width),
          top: Math.min(e.clientY - rect.top, rect.height),
          width: rect.width,
        });
      } catch (err) {
        if (err instanceof AbortError) {
          // Ignore cancelled getBoundingRect calls
          return;
        }
      }
    },
    [onPositionChange, elem],
  );

  const handleOnMouseLeave = useCallback(() => {
    if (controller.current) {
      controller.current.abort();
      controller.current = new AbortController();
    }

    onPositionChange(undefined);
  }, [onPositionChange]);

  return {
    ...rest,
    onMouseEnter: (e: MouseEvent<T>) => {
      handlePositionChange(e);
      onMouseEnter?.(e);
    },
    onMouseMove: (e: MouseEvent<T>) => {
      // prevent outside elements from firing, for example a tooltip
      if (!elem.current?.contains(e.target as Node)) {
        return;
      }

      handlePositionChange(e);
      onMouseMove?.(e);
    },
    onMouseLeave: (e: MouseEvent<T>) => {
      handleOnMouseLeave();
      onMouseLeave?.(e);
    },
  };
}

export default useMouseTracking;
