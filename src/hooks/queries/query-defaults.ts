import type { DefaultOptions } from "@tanstack/react-query";

export const explorerQueryDefaultOptions = {
  mutations: {
    retry: 0,
  },
  queries: {
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 30 * 1000,
  },
} satisfies DefaultOptions;
