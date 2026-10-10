/** Every TanStack Query key in the app is defined here. Features add entries as they arrive. */
export const queryKeys = {
  dev: {
    supabaseSession: ["dev", "supabase-session"] as const,
  },
  landlord: {
    all: ["landlord"] as const,
    me: (userId: string) => ["landlord", userId] as const,
  },
  properties: {
    all: ["properties"] as const,
  },
  rooms: {
    all: ["rooms"] as const,
    active: ["rooms", "active"] as const,
  },
} as const;
