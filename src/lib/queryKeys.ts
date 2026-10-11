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
  charges: {
    all: ["charges"] as const,
    month: (period: string) => ["charges", "month", period] as const,
    tenant: (tenantId: string) => ["charges", "tenant", tenantId] as const,
    statement: (tenantId: string) => ["statement", tenantId] as const,
    balances: ["tenant-balances"] as const,
    generation: (userId: string) => ["rent-charge-generation", userId] as const,
  },
  payments: {
    all: ["payments"] as const,
    tenant: (tenantId: string) => ["payments", "tenant", tenantId] as const,
    month: (period: string) => ["payments", "month", period] as const,
  },
} as const;
