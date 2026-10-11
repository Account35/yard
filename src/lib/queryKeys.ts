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
    inactive: ["rooms", "inactive"] as const,
    property: ["rooms", "property"] as const,
    room: (roomId: string) => ["rooms", roomId] as const,
  },
  tenants: {
    all: ["tenants"] as const,
    current: ["tenants", "current"] as const,
    room: (roomId: string) => ["tenants", "room", roomId] as const,
    detail: (tenantId: string) => ["tenants", tenantId] as const,
    publicPage: (token: string) => ["tenant-page", token] as const,
  },
} as const;
