# Deploying Yard to Netlify

`netlify.toml` already holds the build settings:

- Build command: `npm run build`
- Publish directory: `dist/client`
- Every path is rewritten to `/_shell.html` with status 200, so links like `/t/abc` work.

## Environment variables

Yard needs two variables at build time. In Netlify open
**Site configuration > Environment variables > Add a variable** and add:

| Key                      | Value                                                   |
| ------------------------ | ------------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Supabase > Project Settings > API > Project URL         |
| `VITE_SUPABASE_ANON_KEY` | Supabase > Project Settings > API > `anon` `public` key |

Never add the service-role key. After adding or changing a variable, run
**Deploys > Trigger deploy > Clear cache and deploy site**, because the values are
baked into the build. If one is missing, the app shows a full-screen message naming it.

For phone sign-in in Phase 1, add the Netlify site URL under
Supabase > Authentication > URL Configuration.
