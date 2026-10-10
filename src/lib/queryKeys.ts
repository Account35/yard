/** Every TanStack Query key in the app is defined here. Features add entries as they arrive. */
export const queryKeys = {
  dev: {
    supabaseSession: ["dev", "supabase-session"] as const,
  },
} as const;
