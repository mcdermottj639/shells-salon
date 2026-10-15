# Beauty Shell — CLAUDE.md

Mishell's hair business site + her private owner screen. Built 2026-10-14 by Claude at Jack's request. Read this first; update it in the same turn as any change.

## What it is
- `index.html` — public client page (Spanish first, EN toggle, remembered in `localStorage bs.lang`): hero photo, services, how it works, approved reviews, **request-a-booking form**. With `?review=<token>` it becomes the review form for one finished appointment.
- `owner.html` — Mishell's screen. Opened once with `?k=<owner_token>`; the token is moved to `localStorage bs.owner` and stripped from the URL. Tabs: Solicitudes (confirm with a date/time, discard), Agenda (confirmed → Hecha with a price = sale logged; manual appointments), Ventas (totals this week/month, manual sales), Opiniones (per-appointment review link via WhatsApp, publish/hide), Servicios (price "desde $", minutes, descriptions, hide/show, add).
- `app.js` — shared: RPC helper, translations, WhatsApp link builder. `styles.css` — brand system from the campaign brief (cream #FFF5E8, peach #F6D7C5, red #A40716, copper #BC8155, brown #422713; Lora + Poppins via Google Fonts).
- `photos/` — the three back-view client photos Jack supplied (no faces). `icons/` — shell emblem for Add-to-Home-Screen. Two manifests (client and owner) so each installs as its own icon.
- No build step, no service worker (so updates are instant). Hosting: GitHub Pages from `main` (root). Owner page is `noindex`.

## Data (Supabase project `family-survivor` rjbvcvnwbubxeaxcklgg, schema `salon`)
Shares the project with Family Survivor only because the free tier allows two projects (Jack's decision, 2026-10-14 23:26 ET). **Nothing in `public.*` was changed**; the salon lives entirely in schema `salon`, which anon cannot read (verified: `permission denied for schema salon` as anon).
- Tables: `salon.settings` (single row, holds `owner_token`), `salon.services`, `salon.appointments` (status requested|confirmed|done|cancelled|no_show, `review_token` per row), `salon.sales`, `salon.reviews` (`approved` gate). RLS on, no policies → table access only through functions.
- API = `security definer` functions in `public`, prefix `salon_`, granted to anon:
  - `salon_public()` → business + active services + approved reviews. `salon_request(p)` → inserts a request, returns `{id, keyword}`. `salon_review_submit(p)` → by `review_token`, one review per appointment.
  - Owner (first arg `tok`, checked against `settings.owner_token`; wrong token → `null` / `forbidden`): `salon_owner(tok)` dashboard + totals; `salon_owner_appt(tok,p)` create/update (status done + price → one row in `salon.sales`, `paid_at` set so it never double-logs); `salon_owner_sale`, `salon_owner_review`, `salon_owner_service`, `salon_owner_settings`.
- Migrations: `beauty_shell_salon_schema`, `beauty_shell_fix_json_key_checks` (applied via the Supabase MCP). Keys in `app.js` are the project's publishable key (safe to ship; the token is the secret).
- Owner token: `select owner_token from salon.settings` (Supabase MCP). Give it to Jack/Mishell privately — never in Claudex docs, never in the repo. Rotate with `update salon.settings set owner_token = encode(gen_random_bytes(18),'hex')`.

## Tested (2026-10-14)
- DB cycle as `anon` via SQL: request → confirm → done(price) logs sale → review hidden until approved → approved shows → totals correct; bad token blocked; test rows deleted.
- Browser (Playwright, Chromium, 390 and 1280 px, RPC stubbed): no overflow, EN/ES toggle, request form → WhatsApp link carries `#id` + keyword, review mode, owner gate on bad token, token stripped from URL, confirm/done payloads, review link per done appointment.
- NOT yet verified live: GitHub Pages serving (Jack must enable Pages: Settings → Pages → Deploy from branch `main` / root) and a real browser hitting Supabase. Cloud sessions cannot reach `rjbvcvnwbubxeaxcklgg.supabase.co` (not on Claude's allowed domains); test through the Supabase MCP or ask Jack to add that host.

## Rules
- Spanish first; every client-facing string lives in `app.js` `T.es` / `T.en`.
- No prices, promos or policies appear unless Mishell sets them in Servicios. Reviews show only after she publishes them.
- Nothing posts to Instagram/Facebook or messages anyone; WhatsApp buttons only open a prefilled chat for a human to send.
- Coordination with ChatGPT: Drive folder "claudex" → "Beauty Shell (Mishell Salon) — shared handoff". Claim before work, log evidence after.

## Ideas not built
- Owner push/email when a request arrives (needs a notification channel; WhatsApp Business API is paid). Today she opens the screen or Jack checks Jarvis.
- Google Business Profile link once Mishell decides where she attends.
- Photo upload on the request form (storage bucket + policy); the WhatsApp follow-up covers it for now.
