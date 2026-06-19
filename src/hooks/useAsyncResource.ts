import { useEffect, useRef, useState } from "react";

export interface AsyncResource<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAsyncResource<T>(key: string, loader: () => Promise<T>): AsyncResource<T> {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [resource, setResource] = useState<AsyncResource<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCurrent = true;
    setResource({ data: null, isLoading: true, error: null });

    void loaderRef.current()
      .then((data) => {
        if (isCurrent) {
          setResource({ data, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setResource({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error("Unknown data loading error"),
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [key]);

  return resource;
}
