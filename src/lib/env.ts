import { z } from "zod";

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_PUBLIC_APP_URL: z.string().url().optional().or(z.literal("")),
});

export type Env = z.infer<typeof envSchema>;

export type EnvResult = { ok: true; env: Env } | { ok: false; missing: string[] };

function readEnv(): EnvResult {
  const parsed = envSchema.safeParse({
    VITE_SUPABASE_URL: import.meta.env["VITE_SUPABASE_URL"],
    VITE_SUPABASE_ANON_KEY: import.meta.env["VITE_SUPABASE_ANON_KEY"],
    VITE_PUBLIC_APP_URL: import.meta.env["VITE_PUBLIC_APP_URL"],
  });
  if (parsed.success) return { ok: true, env: parsed.data };
  const missing = [...new Set(parsed.error.issues.map((i) => String(i.path[0])))];
  return { ok: false, missing };
}

export const envResult: EnvResult = readEnv();

export function requireEnv(): Env {
  if (!envResult.ok) {
    throw new Error(`Missing or invalid environment variable: ${envResult.missing.join(", ")}`);
  }
  return envResult.env;
}
