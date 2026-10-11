/** Every route path in the app. */
export const paths = {
  root: "/",
  home: "/home",
  rooms: "/rooms",
  roomDetail: "/rooms/$roomId",
  money: "/money",
  settings: "/settings",
  tenants: "/tenants",
  tenantNew: "/tenants/new",
  tenantDetail: "/tenants/$tenantId",
  tenantEdit: "/tenants/$tenantId/edit",
  tenant: "/t/$token",
  devKit: "/dev/kit",
  SIGN_IN: "/sign-in",
  ONBOARDING: "/onboarding",
} as const;
