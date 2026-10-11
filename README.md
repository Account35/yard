# Yard

Phase 0: Project setup
Goal

Create the foundation of Yard: a Vite + React + TypeScript + Tailwind project with routing, data fetching, a typed Supabase client, design tokens, a small set of base components, a working installable PWA, and the helper functions for money, dates and SA phone numbers that every later phase relies on. No product features yet and no database tables.

Product context

Yard is rent and tenant management for backyard-room landlords in South Africa. It is a standalone mobile-first installable PWA. It works alongside WhatsApp using https://wa.me/<number>?text=<message> links with pre-written text. It is not a WhatsApp bot and it does not use the WhatsApp Business API. Landlords sign in with phone number and SMS code. Tenants never sign in; they open a private link at /t/<token>. Hosting is Netlify. Backend is Supabase.

Context: what already exists

Nothing from earlier phases. If the repo already contains a Vite + React + TypeScript + Tailwind scaffold, extend it instead of re-initialising, and keep any existing config that works. Do not delete existing files you do not understand; ask me first.

Tasks
Project base.
Vite + React + TypeScript with strict mode on, plus noUncheckedIndexedAccess.
Path alias @/ pointing to src/.
Tailwind CSS.
ESLint with typescript-eslint, react-hooks and jsx-a11y rules. no-explicit-any is an error.
Prettier with the Tailwind class-sorting plugin.
package.json scripts: dev, build, typecheck, lint, format, test, types:gen.
Set the Node version to 20 or later.
Vitest for unit tests of the helpers in task 8.
Folder structure. Create exactly this structure. Empty folders get a .gitkeep.
   docs/
     CONVENTIONS.md
   public/
     (icons and PWA assets)
   supabase/
     migrations/        (README only for now)
     functions/         (empty for now)
     seed/              (empty for now)
   src/
     main.tsx
     App.tsx
     router/
       index.tsx        (route definitions)
       paths.ts         (route path constants)
     styles/
       index.css        (Tailwind layers, font, design tokens)
     components/
       ui/              (Button, Input, Select, Card, ListRow, StatusTag, BottomNav, EmptyState, Sheet)
       layout/          (AppShell, TenantShell, PageHeader)
     features/
       auth/
       onboarding/
       rooms/
       tenants/
       charges/
       payments/
       messaging/
       tenant-page/
       utilities/
       reports/
         (each feature will later hold: api.ts, hooks.ts, schema.ts, components/)
     pages/
       landlord/        (Home, Rooms, Money, Settings placeholders)
       tenant/          (TenantPage placeholder)
       dev/             (DevKit, development only)
       NotFound.tsx
     lib/
       env.ts
       supabase.ts
       queryClient.ts
       queryKeys.ts
       money.ts
       dates.ts
       phone.ts
     types/
       database.ts      (Supabase types)
       domain.ts        (app-level types)
Conventions file. Write docs/CONVENTIONS.md containing: the folder structure above; naming rules (components in PascalCase files, hooks named useX, database tables and columns in snake_case, each feature owns its api.ts for Supabase calls, hooks.ts for TanStack Query hooks and schema.ts for Zod schemas, all query keys defined centrally in src/lib/queryKeys.ts, all route paths in src/router/paths.ts); the database rules, code rules and design rules written at the end of this prompt. Every later phase will refer to this file.
Environment and Supabase client.
Variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Provide .env.example. Put .env.local in .gitignore.
src/lib/env.ts validates the variables with Zod at startup. If one is missing, show a plain full-screen message naming the missing variable instead of a blank page.
src/lib/supabase.ts exports one typed client created with the Database type from src/types/database.ts, with session persistence and automatic token refresh on.
Never use or mention a service-role key in frontend code.
Since no tables exist yet, src/types/database.ts is a minimal placeholder Database type with an empty public schema. Add the types:gen script that regenerates this file with the Supabase CLI. Phase 1 will replace the placeholder with generated types.
Router and data fetching.
React Router with a data router.
Routes: / redirects to /home. Inside AppShell (with the bottom nav): /home, /rooms, /money, /settings. Inside TenantShell (no nav): /t/:token. A development-only /dev/kit. A catch-all NotFound.
Lazy-load every page with React.lazy so heavy libraries added later (PDF generation) stay out of the first load.
TanStack Query client with staleTime of 60 seconds, retry of 2, refetchOnWindowFocus off.
The /dev/kit route must not exist in the production build. In production it falls through to NotFound.
The landlord pages are not protected yet. Phase 1 adds authentication.
Design tokens (Tailwind theme and CSS variables).
Colours: ground 
#FAFAF7; ink 
#1A1A1A; ink-muted 
#6B6B6B; line (1px borders) a warm light grey around 
#E3E2DC; surface 
#FFFFFF (only used on a single card level); brand 
#1F5F3F with a slightly darker pressed state; status-paid 
#1F5F3F; status-part 
#B7791F; status-late 
#B23B3B; status-neutral 
#6B6B6B. Check text contrast is at least 4.5:1 everywhere.
Typography: self-host one sans-serif font, either Inter or IBM Plex Sans, from the @fontsource packages (no Google Fonts requests, to save data and work offline). Load only the Latin subset and only weights 400 and 600. Use exactly three sizes: 14px (secondary), 16px (body, and all form inputs, to prevent zoom on iOS), and 24px (page titles and the main amount on a screen). Add a .money utility that turns on tabular figures.
Radius: 4px for inputs and tags, 8px for cards and sheets. No pill shapes.
Elevation: none. Use 1px borders and dividers only.
Spacing: a 4px base scale with 16px as the standard page gutter.
Focus: a visible 2px brand outline with offset on every interactive element. Respect prefers-reduced-motion. Do not disable user zoom.
Base components in src/components/ui, fully styled to the tokens above. Do not leave any library defaults visible.
Button: variants primary (deep green), secondary (1px border, ink text) and quiet (text only). Minimum height 48px. There is no red button; destructive actions use the secondary variant with clear wording. A loading state disables the button and changes its label, for example “Saving”. No spinners with flourishes.
Input: label above the field, optional helper text, optional error text. Errors appear as plain near-black text beneath the field with a darker border. Do not use the status red for form errors, because status colours are reserved for payment status. Support a prefix slot (used for “R” on amounts).
Select: a styled native select, for reliability on cheap Android phones.
Card: a single level only with a 1px border. Cards never nest.
ListRow: primary text, optional secondary text, optional trailing slot, optional chevron. Minimum height 56px, with a divider between rows.
StatusTag: variants paid, part_paid, late, not_due. The text labels are always shown: “Paid”, “Part paid”, “Late”, “Not due”. Colour is never the only signal.
BottomNav: four items, Home, Rooms, Money, Settings, each with a simple line icon from lucide-react (imported individually) and an always-visible text label. The active item is clearly marked. Targets are at least 44px. It respects the iOS safe-area inset.
EmptyState: one plain sentence and one action button. No illustration.
Sheet: a bottom sheet on mobile that becomes a centred modal on wider screens. Built on an accessible primitive (Radix Dialog) with focus trap, Escape to close and a plain backdrop at roughly 40% black with no blur.
Layout components: AppShell (page area plus BottomNav), TenantShell (a minimal header with the text wordmark “Yard”, no nav) and PageHeader.
Helper functions with Vitest unit tests.
money.ts:
toCents converts typed input to integer cents without floating-point arithmetic. It accepts “1200”, “1 200”, “1200,50”, “1200.5” and “R1 200,50”. It rejects negatives, letters and more than two decimals.
formatMoney formats cents the South African way: a non-breaking space as thousands separator, a comma as decimal separator, and the “R” prefix. Whole-rand amounts show no decimals (“R1 200”). Amounts with cents show two (“R1 250,50”). Zero is “R0”. Negative amounts are “-R50”.
Write the formatting by hand. Do not rely on Intl, because ICU data differs on older Android phones.
Add an option showCents: 'always' that always shows two decimals. It is used only for PDF receipts and statements.
phone.ts handles South African mobile numbers:
It accepts “082 123 4567”, “0821234567”, “+27 82 123 4567”, “27821234567”, “0027821234567” and “(082) 123-4567”.
It outputs the E.164 form “+27821234567” (for Supabase sign-in), the WhatsApp form “27821234567” (for wa.me) and a display form “082 123 4567”.
It validates that the number has 9 digits after the country code and starts with 6, 7 or 8. It rejects landlines, short numbers and numbers containing letters.
dates.ts:
Dates are handled as plain YYYY-MM-DD strings and periods as YYYY-MM. This avoids time-zone bugs.
todayInSA returns today’s date in the Africa/Johannesburg time zone, whatever the phone’s own time zone is.
formatShortDate returns “3 Oct”, or “3 Oct 2026” when the year is not the current one.
formatMonthLabel returns “October 2026”.
Also provide toPeriod(date) and dueDateFor(period, dueDay).
Use date-fns where it helps.
Write tests for every helper, including the edge cases listed above.
Placeholder pages. Home, Rooms, Money, Settings and the tenant page each show their title and one honest sentence saying what will appear there. No fake numbers, names or sample data anywhere in the real app.
Development kit page at /dev/kit (development builds only). It shows every base component in every variant and state, a line showing the output of the money formatter for a few amounts, and a “Supabase connection” line that calls supabase.auth.getSession() and reports “Connected” or the exact error. This is a developer tool and must not ship in production.
PWA.
vite-plugin-pwa with registerType: 'autoUpdate'. Do not add update prompts or banners.
Manifest: name “Yard”, short name “Yard”, display: standalone, start_url: /home, background_color and theme_color both 
#FAFAF7, language en-ZA.
Icons: create a simple SVG source (a bold letter “Y” in off-white on a flat deep-green square, no gradient or effects). Generate 192px, 512px, maskable 512px and an Apple touch icon at 180px, using a dev script.
In index.html: lang="en-ZA", a viewport tag with viewport-fit=cover, the theme-colour meta tag and the Apple touch icon link.
Precache the app shell, with an offline navigation fallback to index.html.
Do not cache Supabase requests or auth requests at all in this phase. The offline data cache comes in Phase 8.
Netlify. Add netlify.toml with the build command, the dist publish directory and a single-page-app rewrite sending all paths to /index.html with status 200. Add docs/ note on setting the two environment variables in Netlify.
Git. Initialise git if needed. Make sure .gitignore covers node_modules, dist and .env.local.
Database changes

None in this phase. Do not create any tables. Create supabase/migrations/README.md containing these conventions for the future:

Migration files are named with a four-digit number and a short name, for example 0001_core_tables.sql.
Never edit an old migration. Every change is a new numbered file.
Changes are additive only: new tables, new nullable columns or columns with a safe default. Never drop, rename or retype an existing table or column.
Use CREATE TABLE IF NOT EXISTS, ADD COLUMN IF NOT EXISTS and CREATE INDEX IF NOT EXISTS.
Every new table has Row Level Security enabled with policies so a landlord only sees their own data.
After each migration, regenerate the TypeScript types.
Files to create or change

Everything in the folder structure in task 2, plus: package.json, tsconfig.json, vite.config.ts, tailwind.config.ts, postcss.config.js, ESLint and Prettier configs, index.html, netlify.toml, .env.example, .gitignore, the icon source and generated icons in public/, and the unit test files next to the helpers in src/lib.

Design rules reminder (apply to everything you build)
Calm, serious and trustworthy, like a good bank statement or a neat ledger.
Not gamified: no badges, streaks, points, confetti or celebrations. No emoji anywhere in the UI.
Must not look AI-generated or template-built: no gradients, glows, glassmorphism, sparkle icons, stock illustrations, bubbly pill shapes, heavy shadows or unstyled component-library defaults.
Off-white background, near-black text. Deep green 
#1F5F3F for primary actions only. Amber, muted red and grey are used only for payment status and always come with a text label.
One sans-serif font, three sizes, tabular figures for money. Thin 1px borders, 4 to 8px radius, tap targets of at least 44px, plain human copy with no exclamation marks.
Code rules (apply to everything you build)
TypeScript strict mode, no any.
Money is always integer cents (ZAR).
Mobile first, tested at 360px width, and fast on slow 3G.
Do not rewrite or restructure working code from earlier phases unless a phase requires it; extend it.
Yard is a standalone PWA that works alongside WhatsApp through wa.me links with pre-filled text. No WhatsApp Business API, no chatbot.
Acceptance checklist (test on your phone)
Open the Netlify URL on your Android phone in Chrome. The app loads, shows the Home placeholder and the bottom nav, and there is no horizontal scrolling at 360px width.
Tap Home, Rooms, Money and Settings. Each opens its placeholder, the active item is clearly marked, and every nav target is comfortable to tap with a thumb.
Use “Add to Home Screen” (or “Install app”). Open it from the home screen. It opens full screen with no browser address bar, the Yard icon and name are correct, and the status bar colour matches the off-white background.
With the app installed, switch on airplane mode and reopen it. The app shell still loads instead of an offline error page.
Open /t/anything on the live site. A plain tenant page with the “Yard” wordmark and no bottom nav appears. Open /dev/kit on the live site. It shows the Not found page.
On your computer, run the dev server so it is reachable on your network, and open /dev/kit on your phone. Every component appears in all its variants and states, the money line shows correctly formatted amounts, and the Supabase connection line says “Connected”.
In the kit, tap into an input on Android. The page does not zoom. Open the Sheet. It slides up from the bottom, closes with the back gesture or its close button, and the page behind does not scroll.
The look is calm and plain: no gradients, glows, emoji, pill shapes or heavy shadows, and status tags always show a word.
Run npm run test. All helper tests pass. Run npm run lint and npm run typecheck. Both are clean.
Final instruction

Run the build and type check, fix all errors, commit with message ‘Phase 0: Project setup’, then summarise what you changed.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/de1ca09f-7e30-47e7-9a00-751cc3b029c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
