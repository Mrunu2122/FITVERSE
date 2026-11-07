"use client";

import { useState, useEffect } from "react";

/**
 * Ensures client-only components (like WebGL / Three.js canvases) render safely
 * after hydration without SSR mismatch errors.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
